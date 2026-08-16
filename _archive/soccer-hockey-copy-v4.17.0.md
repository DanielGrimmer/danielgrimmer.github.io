# Soccer Hockey — the copy as it stood at 4.17.0

Every user-facing string on the four Soccer Hockey screens, taken from the tree
at build 4.17.0 — the last one before the page redesign in
`_design/soccer-hockey-pages/`.

Kept because the redesign ships its own `COPY.md`, and a rewrite of the prose is
a separate decision from a rewrite of the layout. Git has the files; this has the
*words*, in one place and in the same order as the new `COPY.md`, so the two can
be read side by side and the choice made line by line rather than by accident.

Where a string is assembled at runtime it is written out here with the seat-
dependent parts in `{braces}`.

Sources: `_pages/soccerhockey.md`, `assets/games/ui/coach.js`, and the three
`assets/SoccerHockey/…V4.0.html` pages.

---

## 4a — landing (`_pages/soccerhockey.md`)

**h1** (front matter `display_title`)

> The Soccer-Hockey Duality Game

**description** (front matter; the theme prints it under the title)

> Soccer and Hockey are very different games... or aren't they?

**body**

> This game must be played with a friend. There is a mystery at the heart of this
> game which the two players should try to solve together after playing their
> first game. In brief, there are two seemingly contradictory ways of looking at
> this game which are nonetheless somehow perfectly coherent with each other. In
> order to preserve the mystery until the end of the first game, however, **there
> must be a strict firewall** between you and your friend. While you can be
> sitting side-by-side for the tutorial, it will be important for the real game
> that you are on **separate devices**, that you **do not peak** at each other's
> screens, and **do not talk** to each other (e.g., mute your audio call). During
> the first game, each player should be focused solely upon their own game
> experience. After this, once you begin comparing notes, the nature of the
> game's central mystery will become apparent.

**the three links**

> Start with the tutorial (Basketball)
> Go straight to the game (Soccer or Hockey)
> The sandbox (after your first game)

**closing**

> While the tutorial can be played side-by-side on one device, you will
> ultimately need to open this webpage on two separate devices. Once you get into
> the same game room, the game state will be synchronized automatically behind
> the scenes.

---

## 4b — tutorial (`SoccerHockeyTutorialV4.0.html`, `ui/coach.js`)

**masthead** — h1 `Basketball`; sub:

> A practice court. Learn the controls here; the real game comes after.

**intro**

> Play both sides yourself, or take turns with whoever is sitting next to you.

**rules, in one place**

> The ball is the orange circle. The yellow highlighted squares are where it can
> go — short steps to the squares around it, longer passes further out. A ✕ marks
> a square the ball has already used, which is closed for the rest of the game.
> The dots in front of each goal are the squares that can reach it on the next
> move. The board wraps onto itself from left to right (like in Pac-Man). Player
> 1 scores at the top right, Player 2 at the bottom left. If the player to move
> has nowhere legal to go, the game is a draw.

**status line** — `Player {n} to move, heading for the {corner}.` /
`Player {n} scores.` / `Nobody can move. It is a tie.`

**buttons** — `Take that back` · `Start again` · `Skip this bit`

### The five steps (`BASKETBALL_STEPS`)

**1. One Ball, Two Goals**

> The ball is the orange circle in the middle. The single gaps in the black walls
> are the two goals. Player 1's goal is the one at the top right, Player 2's goal
> is at the bottom left.
>
> The yellow highlighted squares show where the ball can go next: short steps to
> the squares around it, and longer passes further out. Remember the star-shape
> they make around the ball, you will want to recognize it later.

*hint:* Click any yellow highlighted square to move the ball there.

**2. There is No Going Back**

> Every square the ball leaves is marked with a ✕ and can never be used again.
> Squares only ever close up, they never open: that is what will eventually force
> a goal (or a tie if the ball runs out of places to go).

*hint:* Push it around a little and watch the available spaces thin out.

**3. It's Pac-Man's World, and We're Just Living In It**

> The left-most and right-most columns are connected (like in Pac-Man). Move the
> ball towards the left or right so that the star pattern crosses the “seam”. Now
> move the ball across the seam. The board is a cylinder, and the ball leaving
> one side arrives on the other.

*hint:* Walk the ball off the left or right edge and see where it comes back.

**4. You Miss 100% of the Shots You Don't Take**

> The six dotted squares in front of each goal are the only ones that can reach
> it on the next turn. So to score, you must start your turn on one of them. Land
> on one too early, though, and your opponent will simply knock the ball away,
> and then that dot is burnt. Use them all up and the goal is sealed for good.
> You must be clever…

*hint:* Get the ball onto one of the dots.

**5. Clever Girl…**

> To score, you need for your opponent to move onto one of your dots. You must
> somehow force them to hand you victory. Late in the game, you will both have
> very few options left.

*hint:* Play a game through to the end.

**stalled hint** — That game is over — press “Start again” and pick up where you
left off.

### The outro (`BASKETBALL_OUTRO`) — *Now the Real Game Begins*

> That is the whole interface. The real game is played exactly the same way
> except on a slightly bigger board. The “trick” only works if the two players
> are looking at separate screens (on separate devices) and do not talk to each
> other until the first game is over. So if you and your friend have been working
> through this tutorial together (on one device) you need to split up now. The
> next screen will make sure that you are paired up into the same game room.

*call to action:* Play the Real Game →

---

## 5a / 5b — the game (`SoccerHockeyGameV4.0.html`)

**masthead** — h1 `{Sport} — you are Player {n}`; sub
`Your goal is the gap at the {corner}.`
Spectator: h1 `Soccer Hockey`; sub `Both seats taken — you are watching.`

**room panel** — label `Room`, then the room name.
Buttons: `Copy the invite link` (→ `Link copied`) · `Or join a room by name:` ·
`Join`

**coach body, alone**

> You are the only one here. Send your opponent the invite link, or tell them
> this room name so they can type it in. Once they arrive, stop talking to each
> other until the game is over.

**coach body, both here**

> You are both here. Please stop talking to each other now. Once the first game
> is over, you can call each other and compare notes.

**coach body, spectator**

> This room is full. Pick another room by name below, or ask your opponent for
> their invite link.

**status line** — `Your move.` / `Your opponent's move.` /
`Waiting for a second player to join this room.` /
`Both seats in this room are taken — you are watching. Join another room to play.`
/ `You scored! {callThem}` / `Your opponent scored. {callThem}` /
`Nobody can move. It is a tie. {callThem}`

**presence** — `Nobody else is here yet.` / `Your opponent is here, and moving
about.` / `Your opponent is here but has been still for a while.` / `Your
opponent has stopped responding. Their seat frees up after five minutes.`

**inherited game**

> This room still has somebody else's finished game in it. Press “New game” to
> clear the board and start your own.

**buttons** — `New game` · `Leave this room` · `Let's Look under the Hood →`

---

## 5c — the reveal (`ui/coach.js`, `replayNote`)

**label** — The Big Reveal

**title** — It Was Both Soccer and Hockey, At Once

**body**

> Both boards below show the game you just played, from two radically different
> perspectives. Whereas you thought you were playing {yours}, your opponent
> thought you were playing {theirs}; And this is more than just an aesthetic
> difference (no mere palette swap). Compare the pattern of available moves on
> each board, the Soccer player can kick the ball three spaces to the right,
> whereas the Hockey player can move it, not three, but four spaces.
>
> Now advance through the replay. Every move is exactly as it was actually made,
> in the order it was made. But your friend saw something completely different.
> Almost nothing about their perspective agrees with yours. What seems like a
> short move to the Soccer player, seems like a long move to the Hockey player
> and vice versa. In general, you will disagree about what column the ball/puck
> stands in, as well as the shape of the trails of ✕'s. Nonetheless, you both
> agree where the two goals are and who ultimately won the game. Weird!

*(spectator variant: “…the game that has just finished… {Player 1} thought they
were playing {Soccer}, whereas {Player 2} thought they were playing {Hockey};”
and “But the two players saw completely different things. Almost nothing about
the one perspective agrees with the other.”)*

**after** — carried below the two boards

> What structural features of the game are common across the two perspectives,
> allowing for this kind of consensus? What kind of mathematical transformation
> relates the two players' different representations of this common structure?
> These kinds of dual representations of one underlying structure are now-common
> on the front lines of physics: the AdS-CFT correspondence, T-duality in String
> Theory, etc.
>
> My research seeks to draw epistemic and metaphysical consequences from the
> possibility of such dualities: Are space and time aspects of things-in-
> themselves, or rather an organizational framework which we apply to the world?
> Could an alien society use completely different categories and intuitions to
> make sense of the world? How did we come to have our basic metaphysical
> concepts (quid facti), and what justifies our continued use of them (quid
> juris)? That is, which are universal/objective, and which are idiosyncratic/
> contingent, e.g., upon our particular evolutionary history?

---

## 6a — the sandbox (`SoccerHockeySandboxV4.0.html`)

**masthead** — h1 `The Sandbox`; sub `Working on your own copy.` /
`Room {name} — shared with your friend.`

**panel title** — Let's Look under the Hood

**body**

> Here is a sandbox where you can play around with the game's free parameters to
> see for yourself how the magic happens. All of the dials below are shared (and
> sync'd) and either of you can move the ball at any time. Try changing the
> board's width, its height, and its "duality number" (which must not share any
> prime factor with the width).
>
> The two grids under the boards allow you to adjust the allowed move sets for
> both players in unison. Switch one move on and off to see what this changes
> about the other board. Then try this again with a different duality number. See
> if you can figure out what is going on behind the scenes.

**dials** — `Width` · `Height` · `Duality number`

**buttons** — `Put the ball back at mid-field` · `Restore the published game
settings` · `Back to the real game` · `Leave this room`

**board headings** — `Soccer Field — Player 1` / `Toggle-able Soccer Moves` ·
`Hockey Rink — Player 2` / `Toggle-able Hockey Moves`

**status** — `Both seats here are taken — you are watching, and cannot change
anything.` / `Nowhere left to go. Put the ball back, or change something.` /
`There are no legal moves at all. Switch some on in the grids below.`

**presence** — `Nothing here is being shared — you are working on your own
copy.` / `Nobody else is here yet. Send them the link.` / `Your friend is here,
and moving about.` / `Your friend is here but has been still for a while.` /
`Your friend has stopped responding. Their seat frees up after five minutes.`
