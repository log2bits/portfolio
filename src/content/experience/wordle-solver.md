---
title: Wordle Solver
desc: A Python Wordle solver that averages 3.428 guesses, basically the theoretical best, and the same engine also solves Nerdle and Primel.
tags: [python, algorithms, information-theory, probability, optimization, game-solving]
primaryTech: [Python]
date: "2022"
kinds: [project]
order: 12
image: /images/wordle.webp
---

### TL;DR

This started after watching [3Blue1Brown's video on solving Wordle with information theory](https://www.youtube.com/watch?v=v68zYyaEmEA). I wanted to build my own version and then push it as far as it would go.

The result plays Wordle in **3.428 guesses on average**. A truly perfect solver does it in **3.421**, but it takes over **100 times longer** to run. So mine is close enough to perfect while staying fast enough to actually use while you're playing. The same engine, fed different word lists, also solves Nerdle and Primel, plus an evil mode that plays against you.

[Code's on GitHub.](https://github.com/log2bits/wordle-bot)

### How it picks a guess

A good guess is one that teaches you the most no matter what the answer turns out to be.

So at each step: take a candidate guess and imagine playing it against every word that's still possible. Each of those words would light up a different pattern of greens, yellows, and grays. Group the possible answers by which pattern they'd produce. A great guess splits them into lots of small groups, because whatever the real answer is, you've cut the field way down. A bad guess leaves them in a few big lumps.

That's the idea from the video. I tried a few different ways to measure a "good split": counting the number of distinct patterns, computing the information content (entropy), and computing how many answers you'd expect to have left. They land in roughly the same place, honestly closer than I expected, and I went with whichever gave the best average. The opening guess is hardcoded to SALET, which is the strongest first word that falls out of the analysis.

### The duplicate-letter trap

There's one part of Wordle that's easy to get wrong, and getting it wrong breaks the whole solver without looking like it's broken: repeated letters.

If your guess has two of the same letter but the answer only has one, Wordle won't color both of them. A naive solver overcounts those yellows and then discards the real answer as impossible. So the simulation marks all the greens first, then hands out yellows only up to how many of each letter are left in the answer. That makes the simulated colors match real Wordle exactly, which everything else depends on.

I lost an embarrassing amount of time to this before I worked out what was happening.

### Near-perfect without the price tag

A truly perfect solver looks ahead: for every guess, it considers every follow-up, and every follow-up to that, all the way down. That's correct and it's brutally slow.

Mine skips the deep lookahead. It scores each guess in a single pass over the words still in play, just from how the groups come out, and that alone gets it to 3.428 against the perfect 3.421. Chasing that last 0.007 of a guess is what costs the 100x.

A couple of smaller touches help. When several guesses tie, it prefers one that could itself be the answer, since sometimes you just win. And it precomputes the best second guess for every possible reaction to SALET, so the live tool doesn't stall on that big first calculation.

### Evil Wordle

I also built the mean version. In `evil_wordle.py`, the game never commits to a secret word up front. Every time you guess, it looks at all the color patterns it could still honestly give you and picks the one that keeps the most words in play. It never lies. It just always tells you as little as it can get away with. Good stress test for the solver, deeply annoying to play.

### One engine, more than Wordle

Nothing in the core cares that it's Wordle. It only knows about guesses, answers, and color feedback.

So by swapping the word lists, the same engine solves Nerdle, where the answers are math equations like 52-34=18, and Primel, where they're prime numbers, each with its own best opener. The feedback logic handles answers of different lengths too. One idea, three games, plus the evil twin.

### Why the cheap version wins

The cheap, simple version basically tied the expensive perfect one, and that gap of 0.007 guesses is the whole return on ten-move lookahead. You need one clean idea, measuring how much each guess tells you, and then you need to run it carefully. The rest is diminishing returns.
