---
title: Crowd Surfers
desc: A 2.5D pizza-delivery game from a 100-person student team. I made the case to rebuild the rendering system mid-project, then built the transparency shaders and lighting it enabled.
image: /crowd-surfers-transparency.gif
tags: [godot, game-dev, shaders, rendering, graphics, 3d]
primaryTech: [Godot, GLSL]
date: "2025 - 2026"
kinds: [project, leadership]
order: 1
---

### The short version

Crowd Surfers is a game about Slip, a pizza delivery skater dodging crowds and buildings in a dense, noisy city to get pizzas to the door before their game-show-host boss fires them. It was built by a fully student-run club of more than 100 people at UC Santa Cruz, and it's [playable on itch.io](https://game-design-art-collab.itch.io/crowd-surfers).

My main contribution wasn't a feature, it was a decision. Partway through, I convinced the whole team to tear out and rebuild how the game renders, moving from a fake-3D trick to real 3D with an angled camera. That was a hard sell on a project already far along. Once we'd switched, I built a lot of the stuff the new system made possible: the shader that fades buildings out when you skate behind them, the shadows and lighting, and the camera feel. [Code on GitHub.](https://github.com/GDACollab/Crowd-Surfers)

### The fake-3D system we started with

The original setup faked depth with a top-down camera and flat sprites. When the player jumped, the code didn't move them in 3D, it slid the sprite up the screen to suggest height. To let you walk behind tall things like a bus, the back of each object's collider had to be trimmed inward by an amount that matched the object's height. It worked, sort of, but it leaned on every level designer understanding a fiddly set of collider rules and getting them exactly right.

The cracks showed as we went. Z-ordering, which is what draws in front of what, was tricky to get right with those trimmed colliders and raycasts. Depth was hard to read on screen. Shadows and shading would have helped, but they were hard to add cleanly on top of the unusual collider setup. It was a pile of technical debt that was only going to get more expensive to carry.

### Convincing the team to switch

Here the hard part was people, not code. The project was already pretty far along, and plenty of people, reasonably, didn't want to rebuild something this fundamental. My case was simple: switching to real 3D would be a lot of work, most of it mine, but it was less work than living with the old system all the way to the finish.

Arguing that in the abstract wasn't going to move anyone, so I didn't just argue. I rebuilt an entire level as a working prototype on a proper 3D setup with a 45-degree orthographic camera, using our most complete scene. It turned out to be the most stable, least buggy scene the project had had. That prototype is what won people over, and from there I worked with another programmer to move the rest of the game onto the new system.

![The game running in the new 3D setup, in-engine](/crowd-surfers-in-engine.png)

### The transparency shader

This was the gnarliest piece. In real 3D, the player constantly skates behind buildings, so you need those buildings to fade out when they're blocking the view. The obvious approach is to take the player's position on screen and run a screen-space shader that fades whatever's in front of them. I tried that. It didn't work.

So I did it in 3D instead. I built a pyramid with its tip at the camera and its base anchored to the player's four corners as seen from the camera, so the pyramid covers exactly the space between the camera and the player. Any object poking into that pyramid is blocking the view, so it gets a transparency shader. The game keeps track of which objects are currently faded, smoothly lerps them in and out as you move, and strips the shader back off once they're clear.

![Buildings fading out as the player skates behind them](/crowd-surfers-transparency.gif)

The transparency itself is dithered rather than a smooth blend, because our art is set to alpha-cut "discard" so the z-ordering works, which was a constraint from the asset pipeline. Dithering fakes partial transparency with a pattern of fully-on and fully-off pixels, so it plays nicely with that hard on-or-off cutoff.

### What the switch unlocked

A bunch of things got easier, or became possible at all, only after going to true 3D. Real shadows, actual light sources, and proper environment lighting, none of which fit the old fake-3D setup. I also hooked the player animations into the controller, and added the feel-good camera work: a screen shake when you crash, the field of view widening as you pick up speed, and the camera leaning ahead of you as you move. All of those are smoothed with lerping so they feel nice instead of jerky.

### What I take from it

The shader was the hardest code, but the prototype was the most important thing I made. The real lesson was about technical leadership: when you think a project is heading somewhere painful, opinions don't move a big team, a working demo does. Rebuilding that level to prove out the new system convinced people far better than any argument could have, and it's the part of this project I'm proudest of. Skating behind a building and watching it quietly fade is a close second.
