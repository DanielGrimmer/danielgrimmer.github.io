# Firebase

The games talk to a single Firestore project, `soccerhockeyduality`, shared by
Soccer Hockey and Escher Chess. `firestore.rules` in this directory is the
source of truth for the Security Rules; the console copy should be kept in step
with it. Nothing here is served — the directory begins with an underscore, so
Jekyll skips it.

## What is actually at risk

There is no personal data in this project and no login. The realistic risks are:

| Risk | Severity | Addressed by |
| --- | --- | --- |
| Unbounded document creation running up a bill | **High** | `create: if false` everywhere; removing `MobiusEuclidGames` |
| Junk or oversized fields inflating documents | Medium | shape and length checks |
| A stranger overwriting a game in progress | Medium | *not fixable without auth* — see below |
| Reading someone else's game | Negligible | no private data exists |

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

Optional, independent of the rewrite:

- **App Check** with reCAPTCHA, so requests must come from your site.
- **API-key referrer restriction** to `danielgrimmer.github.io/*` in the Google
  Cloud console. Cheap, and worth doing regardless.
- **A budget alert** on the project. The one genuinely unbounded risk is cost.
