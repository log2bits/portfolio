---
title: Continuous Cut
desc: A 2-bit Fruit-Ninja-meets-Vampire-Survivors slasher, built in Godot with Jack Seales for a class jam.
tags: [godot, game-dev, 2d, pixel-art, game-design, shaders, graphics]
primaryTech: [Godot, GLSL]
date: "2026"
kinds: [project]
order: 13
image: /images/continuous-cut.png
---

### TL;DR

Continuous Cut is a small, relaxing slasher we built in **Godot** for a class jam. We started from two prompt words, "cut" and "spin," and ended up with something like Fruit Ninja crossed with Vampire Survivors. Enemies come at you, you cut them down. We had a pretty limited amount of time, so it isn't all that polished, but it's playable and it's fun.

You can [play it on itch.io](https://jkseales.itch.io/continuous-cut), and the code's on [GitHub](https://github.com/log2bits/continuous-cut).

### The design problem

We wanted Continuous Cut to feel deliberate: carving long clean cuts through multiple enemies, planning the slices ahead of time, getting a nice reward with a bunch of points.

Our first prototypes did the opposite. There was no restriction on slashing, so playtesters just clicked on every enemy the second it spawned. It worked, technically, but it felt like swatting flies. There wasn't good flow.

So instead of giving players more to do, we took an option away. We added a restriction on how the slash could move, so you couldn't jab at whatever popped up. To clear enemies well you had to commit to long, sweeping cuts. That got most of the feeling we wanted back. The parameters for the constraints needed a lot of tuning and I'd still tune them further given more time.

We also wanted a timestop mechanic, where you could let enemies creep closer in exchange for a shot at a bigger combo. It was too much to program in the time we had, so we cut it. Knowing what to drop is part of the job.

### Making the art work

Standardizing and finding the right pixel size for our pixel art took a bit of work, but we figured it out. Deciding on a color palette was also tricky, and with the help of some online resources we managed fine.

We went with a **two-bit color palette**. Keeping the colors simple gives the game a distinct look, and it meant we didn't have to put a ton of time into every sprite. Our friend Sai Hamid drew up the main character sprite pretty quickly while I drew the enemies. All the art came together fast.

### Godot

I had a good amount of prior experience with Godot from Crowd Surfers, so I was confident going in. My friend Jack had less experience and is more geared toward game design, so he took the UI and sound effects while I worked on the enemy and slashing behaviour.

Getting the enemies to move properly was a bit of a pain, but with some online tutorials it got much easier. The slashing mechanic also took some work, though again, not too complicated. The way I got it working was treating the coordinates in polar space relative to the center of the screen (the character) and then limiting the change in radius over time.

One of the most fun parts was the ordered dithering shader I applied to the slash and the slash guide. I took the shader from Crowd Surfers and modified it to work here. The result is a gradient that still only uses 2 colors and looks really cool. I thought about doing a full-screen blue noise dithering pass at some point but we ran out of time. I'll revisit that idea.

### Credits and tools

- Main character sprite by Sai Hamid
- Color palette picked from [Lospec](https://lospec.com/)
- Sound and music from [Pixabay](https://pixabay.com/)
- Enemy logic got a boost from [this tutorial](https://www.youtube.com/watch?v=GwCiGixlqiU)
