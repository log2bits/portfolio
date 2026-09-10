---
title: Sanity Check
desc: A logic-puzzle game made in a week with four friends. Every possible answer to a room is one bit, which turns "is this puzzle any good" into a bitwise AND.
image: /images/sanity-check-transition.gif
tags: [unity, csharp, game-dev, puzzle, solver, procedural-generation, game-jam, shaders]
primaryTech: [Unity, C#]
date: "August 2026"
kinds: [project]
order: 2
---

### TL;DR

Sanity Check is a game about being locked in a logic testing center and having to prove you're sane to get out. Each room has a few doors, exactly one of them safe, and every door makes a statement about the room. Some doors lie. You work out which one to walk through. Five of us built it in a week for Brackeys Game Jam 2026.2, and you can [play it in a browser](https://saisgonerogue.itch.io/sanity-check).

![The white-out transition between rooms](/images/sanity-check-transition.gif)

I built the puzzle engine. Every possible answer to a room is a single bit, every statement a door can make is a set of those bits, and solving a room means intersecting the sets. Once it's shaped like that, the interesting questions about a puzzle stop being hard. [Code's on GitHub.](https://github.com/log2bits/Brackeys-2026)

### Why I took the solver

Five of us. Three programmers, me and Tyler and Chris. Sai on art, Jack on game design.

Sai was working a job at the same time, so art was going to be the tight constraint. We knew going in that the game had to be light on art and heavy on the technical side. A logic puzzle fits that shape well, since the rooms can stay simple and the difficulty lives in the writing and the generator.

The idea was mine. We brainstormed a bunch of directions, I pitched this one, and everyone liked it.

Then there was my problem. I'd never used Unity or C#. Three programmers on a one-week jam, with one of them learning the engine as he goes, is a good way to slow everyone else down. So I took the piece that sits furthest from Unity. The solver is plain C# with no engine dependency. I could build and test it without touching a scene, then wire it up at the end.

Tyler and Chris both had more Unity experience, Tyler especially, so they took more of the in-engine work. I learned a good amount of Unity anyway, which I wanted, just not on the critical path.

### Solvable is not the same as good

Writing one logic puzzle by hand is easy. Writing a thousand isn't, and a jam game needs a lot of rooms, so the game generates them.

The trap is that a generator which only checks "does this have an answer" makes terrible puzzles. It'll happily hand you a room where one door flatly tells you the answer, or where three of the five statements are decoration you never needed to read. Both are technically solvable and both feel like nothing.

The questions I wanted to ask were harder. Is the answer unique? Is every clue load-bearing? How many statements do you have to hold in your head before you can deduce anything at all? None of those are answerable unless you can talk about sets of possible answers cheaply. That's what pushed me into the representation.

### Answers as bits

A **world** is one complete answer to a room. Which door is safe, and which doors are lying. Five doors means five choices of safe door times thirty-two ways the lying could be distributed, so 160 worlds. That's the whole space of ways the room could be.

Then every statement becomes a set of worlds. Whatever a door says, some worlds agree with it and some don't, and I work out which ones up front. Say a door claims "door three is lying." That statement is the set of worlds where door three lies and this door is honest, plus the worlds where door three is honest and this door is the liar.

Once every statement is a set, the hard questions get cheap:

- **Solving the room** means intersecting all the statement sets. Whatever's left is what a player could still believe.
- **The room is fair** when exactly one world survives. Not one *door*, one *world*, because the player has to name the liars too and I wanted that pinned down as well.
- **A clue is load-bearing** if you drop it, re-intersect, and the answer stops being unique.

That third one is my favourite and it's the check I think most puzzle generators skip. Every statement in a finished room has been removed and put back to confirm it's doing real work.

160 worlds means 160 bits, which doesn't fit in anything built in, so the sets are an array of 64-bit words with the operations written by hand. Intersecting is a loop of `&`. Counting survivors is a popcount. Asking whether two sets overlap at all stops at the first non-zero word instead of building an intersection it's about to throw away, because the generator asks that question constantly.

### The rejection loop

With sets in place, generating a room became guess-and-check. Build a candidate, run it past a stack of tests, throw it out if any fail. Up to twenty thousand attempts per room, which sounds absurd until you remember each attempt is a handful of `&` operations over five words.

The tests that survived to the final build:

- Is the answer unique?
- Is every statement necessary?
- How many statements must combine before the first deduction is possible?
- Does any single door give it away?
- Is there a statement at the difficulty tier we asked for?
- Do the room's physical details actually matter?

That last one needs explaining. Some statements refer to things you have to have walked over and looked at, like a tapestry two rooms back. Those are good in moderation and terrible in bulk. A puzzle that's only hard because it's tedious to walk back is just annoying. Remembering isn't thinking. So I track how many doors would still be possible if the player forgot the detail, and reject rooms that lean on memory instead of deduction.

The difficulty knob that worked best was the first-deduction count. A room where any single statement tells you something is easy. A room where you need three before anything moves at all is genuinely hard, and it's one number.

One small thing that paid for itself immediately. Every rejection reason is counted separately. When the generator was producing bad rooms I could look at the tally and see which test was eating everything instead of guessing. That probably saved me a full day.

### What I'd redo

The statement compiler. It works on sentence templates with marked-out blanks, which is how the game builds the accusation dropdowns the player picks from. It re-parses the same template strings over and over inside a loop that's already the hot path. I only got away with it because rooms are small. If we'd shipped with eight doors instead of five I'd have had to fix it during the jam.

I also want to be straight that the thing I'm proudest of here is a data structure decision rather than a clever algorithm. I didn't write a SAT solver. I noticed the search space was small enough to enumerate completely, and once you've enumerated it, every hard question about the puzzle turns into a bitwise AND. Most of the work was seeing that early enough to build on it.

### The rest of it

I also did the game's visual pass. The lighting, the bloom and anti-aliasing and colour grading, and the white-out transition between rooms. That one holds the screen at full blow-out for a beat and then eases off on a squared falloff, so it lands softer than a straight fade. The UI text glows by pushing its colour past 1.0 into HDR, so the bloom pass picks it up on its own. And I worked with Chris on the procedural room generation that places the doors and objects the solver then writes puzzles about.

The whole thing reminded me of FRC. Small team, hard deadline, and everyone trusting that the part they can't see will work on the day. I came out of it knowing Unity and C#, which I didn't a week before.

Made with Chris Green, Jack Seales, Sai Hamid, and Tyler. One week, and it runs in a browser. [Go try it.](https://saisgonerogue.itch.io/sanity-check)
