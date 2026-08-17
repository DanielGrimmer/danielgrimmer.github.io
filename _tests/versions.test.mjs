import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/*
 * The cache-busting convention, held in one place.
 *
 * GitHub Pages serves assets with a ten-minute max-age, so a module fetched at
 * its plain URL keeps loading from cache after an edit — which looks exactly
 * like the change not having shipped. The version therefore rides a ?v= query,
 * and it lives in ONE place per page: an import map. Modules import each other
 * with plain relative paths; the map sends every resolved module URL to its
 * ?v= form.
 *
 * The failure mode this file exists to catch is a silent one: a module missing
 * from a page's map still loads — at its plain URL, cached for up to ten
 * minutes past every deploy. Nothing errors; that one file is just stale. So
 * every page's map must cover every module that exists, at the same version as
 * the page's BUILD constant and its three stylesheet links, and no import
 * anywhere may carry a token of its own.
 */

const read = (p) => readFileSync(p, 'utf-8');

/** Every .js file under assets/games, as the absolute paths a map must cover. */
function moduleList(dir = 'assets/games', out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) moduleList(path, out);
    else if (entry.name.endsWith('.js')) out.push('/' + path);
  }
  return out.sort();
}

const PAGES = [
  'assets/SoccerHockey/SoccerHockeyTutorialV4.0.html',
  'assets/SoccerHockey/SoccerHockeyGameV4.0.html',
  'assets/SoccerHockey/SoccerHockeySandboxV4.0.html',
  'assets/EscherChess/EscherChessTutorialV4.0.html',
  'assets/EscherChess/EscherChessGameV4.0.html',
  '_pages/soccerhockey.md',
];

/** Pages with stylesheet links but no modules of their own. */
const STYLE_ONLY = ['_pages/escherchess.md'];

function importMapOf(source, page) {
  const m = source.match(/<script type="importmap">\s*(\{.*?\})\s*<\/script>/s);
  assert.ok(m, `${page} carries an import map`);
  return JSON.parse(m[1]);
}

/** The one version a page uses, read off its import map. */
function versionOf(map, page) {
  const versions = new Set(
    Object.values(map.imports).map((v) => {
      const q = v.match(/\?v=([\d.]+)$/);
      assert.ok(q, `${page}: ${v} carries a ?v= token`);
      return q[1];
    })
  );
  assert.equal(versions.size, 1, `${page}: one version throughout its map`);
  return [...versions][0];
}

test('the version convention holds everywhere', async (t) => {
  const modules = moduleList();
  const seen = new Set();

  await t.test('modules import each other plainly — the map is the only namer', () => {
    for (const path of modules) {
      const source = read(path.slice(1));
      assert.ok(!source.includes('?v='), `${path} mentions no ?v= token`);
    }
  });

  for (const page of PAGES) {
    await t.test(`${page} maps every module at one version`, () => {
      const source = read(page);
      const map = importMapOf(source, page);
      const version = versionOf(map, page);
      seen.add(version);

      // Every module that exists is in the map — a missing one would load
      // unversioned and silently stale, which no test of behaviour can see.
      assert.deepEqual(Object.keys(map.imports).sort(), modules, `${page} covers the module tree`);
      for (const [key, value] of Object.entries(map.imports)) {
        assert.equal(value, `${key}?v=${version}`, `${page}: ${key} maps to itself, versioned`);
      }

      // The page's own imports lean on the map rather than carrying tokens.
      for (const script of source.matchAll(/<script type="module">(.*?)<\/script>/gs)) {
        assert.ok(!script[1].includes('?v='), `${page}: module scripts carry no tokens`);
      }

      // The three stylesheets cannot ride the map, so they carry it by hand.
      const css = [...source.matchAll(/games\/ui\/(?:fonts|board|pages)\.css[^"]*\?v=([\d.]+)/g)];
      assert.equal(css.length, 3, `${page} links all three stylesheets, versioned`);
      for (const [, v] of css) assert.equal(v, version, `${page}: stylesheets match the map`);

      // And the build stamp reports the same set (the .md page has none).
      const build = source.match(/BUILD = '([\d.]+)'/);
      if (build) assert.equal(build[1], version, `${page}: BUILD matches the map`);
    });
  }

  await t.test('style-only pages ride the same version', () => {
    const version = [...seen][0];
    for (const page of STYLE_ONLY) {
      const css = [...read(page).matchAll(/games\/ui\/(?:fonts|board|pages)\.css[^"]*\?v=([\d.]+)/g)];
      assert.equal(css.length, 3, `${page} links all three stylesheets, versioned`);
      for (const [, v] of css) assert.equal(v, version, `${page}: stylesheets match the maps`);
    }
  });

  await t.test('and it is the same version on every page', () => {
    assert.equal(seen.size, 1, `one version across all pages, got: ${[...seen]}`);
  });
});

/*
 * The fonts are served from this repository rather than from Google, so the
 * two halves of that arrangement have to agree: every face fonts.css declares
 * must exist on disk, and nothing may reach back out to a font CDN.
 */
test('the fonts are ours, and all of them are here', async (t) => {
  const css = readFileSync('assets/games/ui/fonts.css', 'utf-8');

  await t.test('every declared face has its file', () => {
    const srcs = [...css.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)].map((m) => m[1]);
    assert.ok(srcs.length >= 12, `expected the latin subsets, got ${srcs.length}`);
    const present = new Set(readdirSync('assets/games/fonts'));
    for (const file of srcs) assert.ok(present.has(file), `assets/games/fonts/${file} exists`);
  });

  await t.test('and every file is declared — no orphans left behind', () => {
    const srcs = new Set([...css.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)].map((m) => m[1]));
    for (const file of readdirSync('assets/games/fonts')) {
      assert.ok(srcs.has(file), `${file} is declared in fonts.css`);
    }
  });

  /*
   * A *reference*, not a mention: fonts.css's own header explains where these
   * faces used to be served from, and should go on saying so. What must not
   * survive anywhere is a link, a preconnect or a src pointing at the CDN.
   */
  await t.test('no game page reaches out to a font CDN', () => {
    const REFERENCE = /(?:href|src|url\()\s*=?\s*['"(]?https?:\/\/fonts\.(?:googleapis|gstatic)\.com/;
    for (const page of [...PAGES, ...STYLE_ONLY, 'assets/games/ui/pages.css', 'assets/games/ui/fonts.css']) {
      assert.ok(!REFERENCE.test(read(page)), `${page} fetches nothing from a font CDN`);
    }
  });

  await t.test('every page loads fonts.css before the stylesheets that use them', () => {
    for (const page of [...PAGES, ...STYLE_ONLY]) {
      const source = read(page);
      const fonts = source.indexOf('fonts.css');
      const board = source.indexOf('board.css');
      assert.ok(fonts > -1, `${page} links fonts.css`);
      assert.ok(fonts < board, `${page} links fonts.css first`);
    }
  });
});
