---
title: Wordle Solver
desc: A Python Wordle solver that averages 3.428 guesses, basically the theoretical best, and the same engine also solves Nerdle and Primel.
tags: [Python, Algorithms, Information Theory, Probability, Optimization, Game Solving]
kinds: [project]
image: /wordle.webp
---

### The short version

This one started after watching [3Blue1Brown's video on solving Wordle with information theory](https://www.youtube.com/watch?v=v68zYyaEmEA). I wanted to build my own version, then push it as far as it would go.

The result plays Wordle in **3.428 guesses on average**. A truly perfect solver does it in **3.421**, but it takes over **100 times longer** to run. So mine is basically as good as perfect while staying fast enough to use while you play. And the same engine, fed different word lists, also solves Nerdle and Primel, plus an evil mode that plays against you.

[Code's on GitHub.](https://github.com/log2bits/wordle-bot)

### How it picks a guess

The whole idea is that a good guess is one that teaches you the most, no matter what the answer turns out to be.

So here's what it does at each step. Take a candidate guess and imagine playing it against every word that's still possible. Each of those words would light up a different pattern of greens, yellows, and grays. Group the possible answers by which pattern they'd produce. A great guess splits them into lots of small groups, because whatever the real answer is, you've cut the field way down. A bad guess leaves them in a few big lumps.

That's the information idea from the video, and I tried a few ways to measure a "good split": counting the number of distinct patterns, computing the information content (entropy), and computing how many answers you'd expect to have left. They land in roughly the same place, and I went with the one that gave the best average. The opening guess is hardcoded to SALET, which is the strongest first word that falls out of this whole analysis.

### The duplicate-letter trap

There's one part of Wordle that's sneakily easy to get wrong, and getting it wrong quietly breaks everything: repeated letters.

If your guess has two of the same letter but the answer only has one, Wordle won't color both of them. A naive solver tends to overcount those yellows, and then it throws away the real answer as "impossible" when it isn't. So the simulation marks all the greens first, then hands out yellows only up to how many of each letter are left in the answer. That makes the simulated colors match real Wordle exactly, which is the thing the whole solver leans on.

### Near-perfect without the price tag

A truly perfect solver looks ahead: for every guess, it considers every follow-up, and every follow-up to that, all the way down. That's correct, and it's brutally slow.

Mine skips the deep lookahead. It scores each guess in a single pass over the words still in play, just from how the groups come out, and that alone gets it to 3.428 against the perfect 3.421. Chasing that last 0.007 of a guess is what costs the 100x, and it isn't worth it. A couple of smaller touches help too: when several guesses tie, it prefers one that could itself be the answer, since sometimes you just win, and it can precompute the best second guess for every possible reaction to SALET so the live tool doesn't stall on that big first calculation.

### Evil Wordle

I also built the mean version. In `evil_wordle.py`, the game never commits to a secret word up front. Every time you guess, it looks at all the color patterns it could still honestly give you and picks the one that keeps the most words in play. It never lies, it just always tells you as little as possible. It's a good stress test for the solver, and it's deeply annoying to play.

### One engine, more than Wordle

The nice thing about building it around "guesses, answers, and color feedback" is that nothing in the core cares that it's Wordle.

So by swapping the word lists, the same engine solves Nerdle, where the answers are math equations like 52-34=18, and Primel, where they're prime numbers, each with its own best opener. The feedback logic even handles answers of different lengths. One idea, three games, plus the evil twin.

### What I like about it

The fun of this one was that the cheap, simple version basically tied the expensive perfect one. You don't need to look ten moves ahead. You need one clean idea, measuring how much each guess tells you, and then the rest is just running it carefully. And once you have that idea, it doesn't only solve Wordle. It solves the whole family.
