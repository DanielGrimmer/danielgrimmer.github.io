# Firebase

The games talk to a single Firestore project, `soccerhockeyduality`, shared by
Soccer Hockey and Escher Chess. `firestore.rules` in this directory is the
source of truth for the Security Rules; the console copy should be kept in step
with it. Nothing here is served — the directory begins with an underscore, so
Jekyll skips it.

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
| `firestore.rules` | **Publish this now.** Covers the games as they exist today |
| `firestore-next.rules` | Draft for the rewritten games. Do not publish until the new client is live |
| `seed-rooms.mjs` | One-off script to create the room pool, run with admin credentials |

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
