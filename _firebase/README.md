# Firebase

The games talk to a single Firestore project, `soccerhockeyduality`, shared by
Soccer Hockey and Escher Chess. `firestore.rules` in this directory is the
source of truth for the Security Rules; the console copy should be kept in step
with it. Nothing here is served — the directory begins with an underscore, so
Jekyll skips it.

## What to do, and when

V4.0 is live, and the console side of it is done. What is left is hardening.

| # | Step | State |
| --- | --- | --- |
| 1 | Check the visitor counters have a `count` number | **Done** |
| 2 | Enable Anonymous Authentication | **Done** — the games sign in on load |
| 3 | ~~Seed the room pool~~ | Not needed: rooms appear on first use, under a fixed name list |
| 4 | Publish the rules, including `dualitySandboxes` | **Done** |
| 5 | Turn on App Check enforcement | **Open**, and the highest-value thing left — 10 min |
| 6 | Restrict the API key by referrer | **Open** — 5 min |

Step 5 needs the page to request a token before enforcement is switched on, or
it will block the game. See below.

### 1. Check the visitor counters — no longer applicable

This step was about `sharedData` and `EscherChessGames`, the collections the
V3.1 and V1.2 games used to hand out Player 1 / Player 2 from a site-wide
counter. Both games are archived and their rules blocks are gone, so nothing
can reach either collection.

**Delete `games`, `EscherChessGames` and `sharedData` in the console**, under
Firestore Database → Data. Deleting a collection there means selecting it and
choosing *Delete collection*; the rules already deny every path that is not
matched, so leaving them would be harmless, only untidy.

### 2. Enable Anonymous Authentication — done

This does not add a login screen. It lets a browser quietly obtain a stable ID,
so a seat can belong to *somebody* rather than to whoever writes first.

Console → Build → **Authentication** → *Get started* if you have never opened it
→ **Sign-in method** tab → **Anonymous** in the provider list → toggle *Enable*
→ *Save*.

Both V4.0 collections require it: their rules begin `request.auth != null`.

### 3. The room pool — nothing to do

Rooms are created on first use, but only under one of the twenty names in
`assets/games/net/rooms.js` and only as an empty game, so the number of
documents this project can hold is still fixed — twice twenty, since the game
and the sandbox each keep their own document per name.

### 4. App Check — now worth doing

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
| Unbounded document creation | **High** | `create` is allowed only under one of twenty fixed names, in three collections, so the count is bounded at sixty whatever anybody sends |
| Junk or oversized fields inflating documents toward the 1 GB cap | Medium | shape and length checks |
| A stranger overwriting a game in progress | Medium | Seats are held against an anonymous uid, and only the seat on move may append |
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

- an unauthenticated read of `dualityRooms/RedPuck` → **denied**
- a write to `dualitySandboxes/NotARoom` → **denied**
- a write to `escherRooms/RedPuck` changing `board` while moves stay → **denied**
- a write to any path under `games/` or `sharedData/` → **denied**
- a normal move on an existing game document → **allowed**

If a legitimate write is refused after publishing, the shape check is the first
suspect: compare the field list in the rule against the object the client
actually writes.

## Files here

| File | What it is |
| --- | --- |
| `firestore.rules` | The whole published rules file. Paste it over what is in the console |

There is nothing else. A seeding script lived here for a while; rooms are
created lazily under a fixed name list, so it was never needed, and it was the
only thing in the repository that would have wanted a service-account key.

## The collections, and what guards each

| Collection | Written by | The guarantee |
| --- | --- | --- |
| `dualityRooms` | Soccer Hockey | One move appended at a time, by the seat whose turn it is |
| `dualitySandboxes` | The Soccer Hockey sandbox | Anything, by either seat — but only by a seat |
| `escherRooms` | Escher Chess | The same as `dualityRooms`, plus: the board is fixed for the whole of a game, and may change only on a reset |

There is no Escher Chess sandbox: its rules are specific enough that letting a
player design pieces would be a different activity rather than a closer look at
this one.

All three require Anonymous Authentication and all three restrict document ids
to the twenty room names, so the number of documents this project can hold is
fixed — sixty — no matter what anybody sends.

They are separate because their contracts are opposites. In the game, the whole
point is that neither player can meddle: the rule counts the move log and checks
its parity, which is checkable in the rules language where validating a board
state is not. In the sandbox the reveal has already happened, there is nothing
left to keep from anybody, and either player may change the board size, the
duality number, the move set or the ball's position at will. Keeping those two
in one document would mean one rule trying to be both, and a mistake in the
loose half could reach a game in progress.

What the sandbox rule cannot check is the *contents* of the move set — the rules
language will not walk a list — so it compares its length instead. Somebody
signed in who knew a room name could therefore swap one offset for another
without sitting down. That is the loosest thing the file permits, on a
scratchpad either seat can overwrite with one click.

Still worth doing:

- **App Check** with reCAPTCHA. On Spark this is the only thing standing between
  a bored stranger and a day of downtime. See above.
- **API-key referrer restriction** to `danielgrimmer.github.io/*` in the Google
  Cloud console. A referrer header can be forged, so this deters rather than
  prevents — but it is free and takes a minute.

A budget alert is *not* worth setting up: on Spark there is no billing account
to attach one to. Quota exhaustion is the failure mode, and it shows up as the
games silently refusing to sync rather than as a warning email. If they ever do
go dark for a day with no obvious cause, check the Firestore usage page first.
