---
title: "Testing the limits of Bitsy"
desc: A 1-bit Bitsy puzzle game with 2,000+ lines of game data. Made by generating the Bitsy format directly with an algorithm.
tags: [bitsy, puzzle, procedural-generation, creative-coding, 1-bit]
primaryTech: [Bitsy]
kinds: [project]
date: "2025"
order: 15
image: /images/floodfill.png
---

### TL;DR

A puzzle game in **Bitsy**, a tiny engine for making little browser games out of 8x8 sprites and barely any programming. The puzzle is simple to describe: fill every tile on a grid without ever crossing your own path. Building the levels by hand would have been brutal in an engine this limited, so I wrote a script to generate the game data directly. The finished game is over 2,000 lines of Bitsy data.

Here's the game if you wish to play it: https://log2bits.itch.io/floodfill

### Getting into Bitsy

The first Bitsy game I ever played was [Under a Star Called Sun](https://haraiva.itch.io/under-a-star-called-sun), and it caught me off guard. The engine is brutally limited, down to the art, and that's exactly what makes these games good. Every pixel has to earn its place. I bounced around the popular Bitsy games for a while and it was kind of overwhelming. The care people put into individual pixels is wild.

I'm a programmer and not an artist. So I went looking for an idea that leaned on code and story instead of art. Bitsy's programming side is just as limited as its art (you get conditionals, variables, and not much else) but I figured there was something there.

### The ideas that didn't work

First idea: a murder mystery in space. You're one of three crew members on a small ship, and you wake up to a crewmate dead on the floor, a wrench next to the body, and your other crewmate in the doorway already sure you did it. You explore the ship, find clues, bring them back, slowly win your friend over, and eventually turn up a stowaway who was the real killer. Simple art, fun programming, a real story. I thought it'd be great.

Then I tried to draw it. Tiny sprites are hard, and Bitsy makes it worse when you want something big that spans multiple tiles. Even centering custom text is a pain. I got one room going, drew the people and the body, and then completely lost the fight with the blood. It either looked like nothing or it looked like hair. And the rooms were huge. Four of them would each need a ton of detail, which is the thing I'm worst at.

Back to the drawing board. I tried a few more ideas, including one where you're a mouse cursor in a retro operating system. But text is hard, and even a decent 8x8 1-bit cursor is hard.

### Going simpler

So I went looking for simpler games to learn from. [Roomba Quest](https://st33d.itch.io/roomba-quest) stuck out. You're a roomba running around doing roomba things. There's more to it and the story gets better, but the core is that simple. The useful part is that a roomba is just a rounded square with a face, so the art never has to fight the 8x8 palette. [You Are Dough](https://npckc.itch.io/you-are-dough) pulls the same trick: you play a lump of dough, no detail needed, and it works.

Bitsy games feel best when the art leans into the engine's limits instead of fighting them. Took me three abandoned ideas to figure that out.

### Ouroboros

Then I found [Ouroboros](https://ledoux.itch.io/ouroboros), which did something I'd never seen in a Bitsy game. The player leaves a trail behind them, and if you run into your own trail the game restarts. Dead simple to play. Very much not simple to build in Bitsy.

So I downloaded the game files, and what I found was a little insane. Hundreds of variables, dialogues, and items, one set for every cell on the grid, each with its own conditionals, all wired together to make that one mechanic. I kept playing expecting something to trigger when you filled the whole screen, and nothing did. The dev never added a win condition. That gap is what gave me my game.

### Building mine

I wanted to take the Ouroboros idea the rest of the way: add a victory condition, add levels, and add sections that start out already filled.

Filling a grid without ever crossing your own path is a **Hamiltonian path**, and finding one is NP-complete. Which is a fancy way of saying it's really hard for a computer to solve in general, and that's exactly what makes it a decent puzzle for a person.

The art was easy this time. The logic was the monster. Bitsy data for something like this is enormously repetitive, one chunk per cell, so instead of writing it all by hand I made a small script to generate the repetitive parts and imported them straight in. On top of that I needed a per-level counter tracking how many tiles were filled, plus logic to only move to the next level once every tile was covered. The rest was close to how Ouroboros works, which did not make it easy. It took me hours just to get the logic behaving, and when it finally clicked it was extremely satisfying. I still can't quite believe this runs in plain Bitsy.

### What's still broken

When you mess up, the whole game resets instead of just the level. I couldn't find a clean way to fix it and it would take a lot more complicated logic to pull off in Bitsy. It's the thing I'd change first if I went back.

Past that, and maybe designing more levels, I'm out of things to add. It's in a good spot and I'm happy with how it came out.
