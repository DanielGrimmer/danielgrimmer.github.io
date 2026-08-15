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
| 4 | Publish the rules | **Done** — `dualityRooms`, `dualitySandboxes`, `escherRooms` |
| 5 | Restrict the API key by referrer | **Open** — 5 min, no downside |
| 6 | Register App Check, and leave it unenforced | **Open** — the client side is done and inert; it needs a site key |
| 7 | Check whether the Gemini API is enabled, and disable it if unused | **Open** — this is the only thing here that can cost money |

Steps 5 and 7 are worth doing. Step 6 is worth *registering* and probably not
worth enforcing; the reasoning is below, because the trade is not obvious.

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
documents this project can hold is still fixed — sixty, since Soccer Hockey's
game, its sandbox and Escher Chess each keep their own document per name.

### 4. The rules — done

`firestore.rules` here is the whole published file. Paste it over what is in the
console whenever it changes; there is no partial update.

### 5. Restrict the API key

Google Cloud console (not the Firebase one) → APIs & Services → **Credentials**.

**Check the project first.** The picker at the top of the Cloud console must
read `soccerhockeyduality`; it opens on whichever project you last used, and
every other instruction here is about the wrong thing if it is showing another
one.

The key may not be called "Browser key"; what identifies it is the value, which
must match `apiKey` in `assets/SoccerHockey/firebaseConfig.js` —
`AIzaSyAAQi…`. A key with the note *"this key can currently be used with any
application"* is an unrestricted one, which is what this step fixes. If the
project holds no key with that prefix, do not restrict anything: find out why
first, because the games sign in with that key and nothing else.

**Websites.** `https://danielgrimmer.github.io/*` is the whole of it. Google
does not accept a wildcard port, so `http://localhost:*/*` is refused; if you
ever want to run the site locally against real Firebase, name the port —
`http://localhost:8080/*`. It is not otherwise needed.

**API restrictions.** A Firebase project enables around twenty-six APIs, and
this key is allowed to call all of them by default. The web client uses five:

| API | What breaks without it |
| --- | --- |
| Identity Toolkit API | Anonymous sign-in — that is, everything |
| Token Service API | Refreshing the ID token, so play stops after an hour |
| Cloud Firestore API | Every read and write |
| Firebase Installations API | App Check, which needs an installation id |
| Firebase App Check API | App Check |

Everything else on the list belongs to a Firebase product these games do not
touch — Storage, Hosting, Messaging, Remote Config, ML, Crashlytics, the
Realtime Database — or is an admin API the console uses on its own credentials
rather than this key. Narrowing to the five is safe and is worth doing for one
reason in particular: **Firebase AI Logic API** is on the default list, and it
is the door to the billable generative APIs that produced the unrestricted-key
banner in the first place. A key that cannot call it cannot run up a bill,
whatever else goes wrong.

Be honest about the rest of the benefit, though: the key is public by design and
the website restriction already says where it may be called from, so narrowing
the API list is hygiene rather than defence.

If sign-in stops working after saving, this list is the first suspect — put
Identity Toolkit and Token Service back. The page says so itself: `explain()`
names a rejected key, and a restriction that does not cover this site looks
identical from the browser to a key that was deleted.

**One trap worth recording**, because it cost half an hour: the Google Cloud
console's project picker only lists projects you have opened before, and a
Firebase project does not appear there until something makes you visit it. So
"there is only one project, and its key is not the one in `firebaseConfig.js`"
means you are looking at the wrong project, not that the key has gone. The
games' key lives in the Cloud project called `soccerhockeyduality`, which is the
same thing as the Firebase project of that name.

Be clear about what this buys. A `Referer` header is trivially forged by
anything that is not a browser, so it stops somebody pasting the config into
their own page and does not stop a script. It costs nothing and has no failure
mode, which is the whole argument for it. Allow about five minutes for it to
take effect.

### 6. App Check

App Check attests that a request came from this site rather than from something
holding a copy of the config. It is the only defence available against the one
thing that can actually take these games down — see the quota table below — and
no Security Rule can substitute for it, because a rule judges each write alone
and has no memory.

**The client side is done, and the key is in.** `assets/games/net/room.js`
starts App Check in `ensureApp()`, before the first read or write, whenever
`appCheckSiteKey` in `firebaseConfig.js` is non-empty — which it now is, so
every request from the live site carries a token and the reCAPTCHA script loads
with the page. Blanking that one string turns the whole thing off again,
including the third-party request, which is the way back if enforcement ever
proves more trouble than it is worth.

Two keys are involved and only one of them is public:

| | What it is | Where it goes |
| --- | --- | --- |
| **Site key** | `6L…`, identifies the site to reCAPTCHA | `firebaseConfig.js`, in this repository |
| **Secret key** | `6L…`, verifies tokens server-side | The Firebase console, once, at registration — **never** in this repository |

The order to do this in, and the one part that cannot be got wrong:

1. **Get the pair.** Both keys come from the reCAPTCHA admin console at
   <https://www.google.com/recaptcha/admin/create>, not from Firebase: register
   a site, choose **reCAPTCHA v3** (score-based), and add the domain
   `danielgrimmer.github.io` — bare, with no scheme and no path. It issues a
   site key and a secret key, both long strings beginning `6L`.
2. **Register.** Firebase console → Build → App Check → *Apps* tab → the web
   app → reCAPTCHA. Its one field is the **secret** key, pasted verbatim.
   Firebase keeps it server-side to verify tokens; it never asks for the site
   key, because that lives in the page. A token time-to-live of one day is a reasonable
   default: longer means fewer reCAPTCHA round trips and a slightly longer
   window in which a stolen token is still good.
3. **Paste the site key** into `appCheckSiteKey` and deploy.
4. **Watch, and do not enforce.** App Check → *APIs* tab → Cloud Firestore.
   Registering an app does not enforce anything, so there is nothing to switch
   off; a newly registered project sits at **Unenforced** and reports metrics.
   Play a game and confirm your own requests are counted as verified.
5. **Only then**, if you ever want to, press *Enforce*.

A wrong secret key is invisible until step 5: unenforced, nothing checks it, so
the registration looks fine and every token silently fails to verify. If the
secret was ever typed by hand rather than pasted, replace it before enforcing.

Enforcing before step 2 has shipped blocks your own game immediately, and that
is the only irreversible-feeling mistake available here. Note also that
Authentication has its own enforcement toggle: anonymous sign-in happens before
any Firestore call, so if that is enforced too, it has to work first.

Once enforced, a machine that is not the live site needs a debug token. The
client sets `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true` automatically on
localhost, which prints one to the browser console; register it under App Check
→ Apps → *Manage debug tokens*.

**Why unenforced is probably the right resting place.** Enforcement adds a
Google reCAPTCHA script to the game pages — a third-party dependency and a
privacy consideration on an academic site — and if reCAPTCHA fails for a
visitor with strict blocking, they cannot play, and it looks to them like the
game is broken. That is a poor trade against a threat nobody has yet posed.
Registered-but-unenforced gives the metrics and makes enforcement a single click
if abuse ever appears.

### 7. The Gemini API

If the Google Cloud console shows a banner about *unrestricted API keys* on
projects with the Gemini API (`generativelanguage.googleapis.com`) enabled, deal
with that before anything else here. It is the only thing in this project that
can generate a bill: Firestore on the free plan stops serving when a quota is
spent, whereas a generative API is billable, and an unrestricted key that can
reach it is a genuine exposure rather than a tidiness matter.

Find out which project it means — the banner links to it — and then:

- **If it is not `soccerhockeyduality`**, this is nothing to do with the games;
  fix it wherever it belongs.
- **If it is, and nothing uses it**, disable the API rather than restricting the
  key: APIs & Services → *Enabled APIs & services* → Generative Language API →
  **Disable**. Firebase turns it on as a side effect of opening some of its AI
  features, so it may well be enabled without ever having been used. Disabling
  removes the exposure entirely, which restricting a key does not.

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
| Scripted writes exhausting the daily quota and taking the games offline | **High** | App Check, if enforced — step 6. Rules cannot rate-limit |
| An unrestricted API key reaching a *billable* API | **High**, if the Gemini API is enabled | Step 7: disable the API, or restrict the key |
| Unbounded document creation | **High** | `create` is allowed only under one of twenty fixed names, in three collections, so the count is bounded at sixty whatever anybody sends |
| Junk or oversized fields inflating documents toward the 1 GB cap | Medium | shape and length checks |
| A stranger overwriting a game in progress | Medium | Seats are held against an anonymous uid, and only the seat on move may append |
| Reading someone else's game | Negligible | no private data exists |

Writes bind first, and the exposure is abuse rather than traffic — which is
what makes App Check the only lever that would change anything, and also what
makes it hard to justify enforcing. See step 6.

## What is in this repository, and what is not

The rules file is here. The Firebase **project settings** are not, and cannot
be: enabling Anonymous Authentication, App Check, API-key referrer restrictions
and budget alerts are all console actions.

The API key and the App Check site key in
`assets/SoccerHockey/firebaseConfig.js` are *not* secrets. Firebase web keys
identify a project and a reCAPTCHA site key identifies a site; neither grants
access, and the rules are the access control. The reCAPTCHA **secret** key is a
real secret, is not in this repository, and belongs only in the console.

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
