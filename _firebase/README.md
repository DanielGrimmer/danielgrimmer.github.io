# Firebase

The games talk to a single Firestore project, `soccerhockeyduality`, shared by
Soccer Hockey and Escher Chess. `firestore.rules` in this directory is the
source of truth for the Security Rules; the console copy should be kept in step
with it. Nothing here is served — the directory begins with an underscore, so
Jekyll skips it.

## What to do, and when

Most of this can wait. In order:

| # | Step | When | How long |
| --- | --- | --- | --- |
| 1 | Check the visitor counters have a `count` number | **Now** — the published rules depend on it | 2 min |
| 2 | Enable Anonymous Authentication | **Now** — harmless, and V4.0 needs it | 2 min |
| 3 | ~~Seed the room pool~~ | Not needed — rooms appear on first use, under a fixed name list | — |
| 4 | Turn on App Check enforcement | After V4.0 is live and sending tokens | 10 min |
| 5 | Restrict the API key by referrer | Any time | 5 min |

Doing 4 early does no good — App Check enforcement would block the game, which
does not yet request a token.

### 1. Check the visitor counters — do this now

The published rules say a counter may only be replaced by a number exactly one
higher than the one already there. That rule can only work if the document
already holds a `count` number. If one does not, the write is denied and the
old tutorial page can no longer hand out Player 1 / Player 2 to *new* visitors.

Console → Firestore Database → **Data** tab. Look at:

- every document in `sharedData` named `visitors_<RoomName>`
- every document in `EscherChessGames` whose name contains `visitors_`

Each needs a field called `count` whose type is **number**. If one is missing
or is a string, click the document, add or fix the field, and save. Anyone who
has played before is unaffected either way — their side is already cached in
their browser.

### 2. Enable Anonymous Authentication — do this now

This does not add a login screen. It lets a browser quietly obtain a stable ID,
so a seat can belong to *somebody* rather than to whoever writes first.

Console → Build → **Authentication** → *Get started* if you have never opened it
→ **Sign-in method** tab → **Anonymous** in the provider list → toggle *Enable*
→ *Save*.

Nothing changes on the site until V4.0 ships, so this is safe to do at any time.

### 3. The room pool — nothing to do

Rooms are created on first use, but only under one of the twenty names in
`assets/games/net/rooms.js` and only as an empty game, so the number of
documents this project can hold is still fixed. `seed-rooms.mjs` is kept in case
you ever want them pre-created, but it is not part of setup.

### 4. App Check — after V4.0 is live

The project ID and API key sit in the page source, as they are meant to. That
means anyone can send writes to the database from outside your site. On the
free plan there is no bill, but there *is* a daily cap: about 20,000 writes.
Somebody scripting writes could burn through that and Firestore would refuse
everything until the quota resets — your games would simply stop working.

App Check closes that. The page fetches an invisible reCAPTCHA token, Firebase
verifies it, and requests without one are rejected. No rule can do this, because
rules judge each write on its own and cannot count them.

Console → **App Check** → register the web app with reCAPTCHA v3 → add the site
key to the client → then, and only then, switch Firestore to *Enforced*.

Order matters: enforcing before the client sends tokens blocks your own game.
There is a monitoring mode that reports what *would* be rejected — leave it
there for a day before enforcing.

### 5. Restrict the API key

Google Cloud console → APIs & Services → Credentials → the browser key → under
*Application restrictions* choose **HTTP referrers** and add
`danielgrimmer.github.io/*`. A referrer can be forged, so this deters rather
than prevents, but it is free.

## What is actually at risk

The project is on the **Spark (free) plan**. That changes the threat model in
one important way: there is no bill to run up. Exceeding a quota *disables the
service* for the rest of the day rather than charging for it. So the worst
realistic outcome is not an invoice — it is the games going dark, and a very
cheap way for someone to do that deliberately.

Daily quotas, and what the games spend against them:

| Quota | Spark limit | A 20-minute game costs roughly |
| --- | --- | --- |
| Document writes | 20,000/day | ~70 (40 heartbeats + ~30 moves) |
| Document reads | 50,000/day | ~140 (each write pushes a snapshot to both players) |
| Deletes | 20,000/day | 0 — deletes are denied |
| Stored data | 1 GB | a room document is well under a kilobyte |
| Bandwidth | 10 GB/month | negligible |

Writes bind first: about 280 games a day before anything stops working, which
is far beyond any plausible real use. The exposure is abuse, not traffic.

There is no personal data here and no login, so:

| Risk | Severity | Addressed by |
| --- | --- | --- |
| Scripted writes exhausting the daily quota and taking the games offline | **High** | App Check — see below. Rules cannot rate-limit |
| Unbounded document creation | **High** | `create: if false` everywhere; removing `MobiusEuclidGames` |
| Junk or oversized fields inflating documents toward the 1 GB cap | Medium | shape and length checks |
| A stranger overwriting a game in progress | Medium | *not fixable without auth* — see below |
| Reading someone else's game | Negligible | no private data exists |

**App Check is the highest-value remaining step**, and it is free. It attests
that a request came from your own site, which is the only defence here against
someone scripting writes until the quota trips. No rule can impose a rate limit.
Console → App Check → register the web app with reCAPTCHA v3, then enforce it
for Firestore. Turn on enforcement only once the new client requests a token,
or live traffic will start failing.

## What is in this repository, and what is not

The rules file is here. The Firebase **project settings** are not, and cannot
be: enabling Anonymous Authentication, App Check, API-key referrer restrictions
and budget alerts are all console actions.

The API key in `assets/*/firebaseConfig.js` is *not* a secret. Firebase web keys
identify a project; they do not grant access. The rules are the access control.

## Applying the rules

Firebase console → Firestore Database → Rules → paste → **Publish**. Use the
Rules Playground on that page to spot-check before publishing:

- a write to `games/game_RedPuck` carrying an unexpected field → **denied**
- a write to `sharedData/visitors_RedPuck` setting `count` to 999 → **denied**
- a create anywhere → **denied**
- a normal move on an existing game document → **allowed**

If a legitimate write is refused after publishing, the shape check is the first
suspect: compare the field list in the rule against the object the client
actually writes.

## Files here

| File | What it is |
| --- | --- |
| `firestore.rules` | The whole published rules file. Paste it over what is in the console |
| `seed-rooms.mjs` | Not needed any more — rooms are created lazily under a fixed name list. Kept in case you ever want to pre-create them |

## The next round, with the rewrite

These interim rules cannot tell a player from a vandal, because nothing
identifies the writer. Two changes fix that together:

1. **Enable Anonymous Authentication** (Console → Authentication → Sign-in
   method → Anonymous). Every browser silently gets a stable `uid`, with no
   login for the user. Rules can then require `request.auth != null`.
2. **Store a move log rather than a state snapshot.** Seats are claimed against
   a `uid`, and a rule can enforce *append exactly one move, and only if you
   hold the seat whose turn it is* — which is checkable in the rules language,
   whereas validating a whole board state is not.

Together those turn "anyone who knows the room name can overwrite anything"
into "only the player whose turn it is can add a move".

Independent of the rewrite:

- **App Check** with reCAPTCHA. On Spark this is the only thing standing between
  a bored stranger and a day of downtime. See above.
- **API-key referrer restriction** to `danielgrimmer.github.io/*` in the Google
  Cloud console. A referrer header can be forged, so this deters rather than
  prevents — but it is free and takes a minute.

A budget alert is *not* worth setting up: on Spark there is no billing account
to attach one to. Quota exhaustion is the failure mode, and it shows up as the
games silently refusing to sync rather than as a warning email. If they ever do
go dark for a day with no obvious cause, check the Firestore usage page first.
