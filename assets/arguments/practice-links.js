// Stable, answer-hidden practice URLs. Both links and random draws respect
// the same method-specific problem-set locks and exam quarantine.
export const METHOD_KEYS = ["table", "tree", "nd"];
export const LEVELS = ["easy", "medium", "hard", "extremely hard"];

export const practiceLink = (id, method) => `#arguments/${encodeURIComponent(id)}/${method}`;
export const isArgumentRoute = (hash) => hash === "#arguments" || hash.startsWith("#arguments/");

export function parsePracticeLink(hash) {
  const match = /^#arguments\/([^/]+)\/(table|tree|nd)$/.exec(hash);
  if (!match) return null;
  try {
    return { id: decodeURIComponent(match[1]), method: match[2] };
  } catch {
    return null;
  }
}

export function canPractise(entry, method) {
  return !!entry && METHOD_KEYS.includes(method) &&
    !entry.course?.quarantined && !entry.course?.problem_set?.[method] &&
    LEVELS.includes(entry.difficulty?.[method]) &&
    (method !== "nd" || (entry.nd?.exists === true && entry.verdict?.valid === true));
}

export function resolvePracticeLink(hash, db) {
  const route = parsePracticeLink(hash);
  const entry = route && db.byId.get(route.id);
  return route && canPractise(entry, route.method) ? { entry, method: route.method } : null;
}
