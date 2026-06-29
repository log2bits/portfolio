---
layout: ../layouts/BaseLayout.astro
title: About Me
---

What I like most is a hard problem. The kind with no clean answer, where the constraints fight each other and you have to find, or build, the best way through. Sometimes that's making something that didn't exist before. Sometimes it's taking something that already works and making it work a lot better. I'm a computer science student at UC Santa Cruz, going into my third year, and that's the thread through almost everything I've built.

It shows up in different shapes. I'm building a voxel renderer from scratch, around a data structure I designed that holds a scene in a fifth the space while staying fast to render straight on the GPU. I worked out how to lay all 16 million RGB colors into a single image that reads as one smooth gradient, with a method I haven't seen anyone else use. I tuned a production service until it ran 39% faster and cost 92% less, for the same output. And I built a robot that fuses its sensors to know where it is on the field to within a centimeter. Different problem every time. The part I love never changes: pull the constraints apart and find the version that wins.

So let me be straight about speed, since it's the one people assume. I love making things fast. It's a big reason I learned Rust. But the fast I care about is fast without cutting corners. Anyone can make something quick by making it worse, or keep it good by throwing performance out the window. The spot I want is both at once: fast, with the output just as good as before or better. That's the harder version, and it's the one worth doing.

### What I'm looking for

A software engineering internship, and I'm casting a wide net on purpose. Not just graphics. I'd be glad to spend a summer on backend, infrastructure, performance, embedded, or rendering, anywhere the problem is hard and I get to ship something real next to engineers I can learn from. I'm two years in with a couple more to go, and I'm using them to figure out which kind of hard problem I want to go deepest on. I lean a certain way already. I'd just rather test that against a few real ones than bet the whole thing on a single lane this early.

### How I work

The work I'm proudest of usually isn't a feature, it's a call I made. On a game built by a 100-person student team, I got convinced our rendering setup was going to rot into something we couldn't dig out of. So instead of arguing about it, I rebuilt a full level on a new 3D system to prove the point, and that prototype is what got the whole team to switch. The transparency shader I wrote afterward was the harder code, but convincing people to do the rewrite was the actual win.

I also care about making things other people can pick up, so I write stuff down. My robotics team has a wiki I built from scratch so the hard parts survive after I graduate, and every project on this site has a real writeup, because being able to explain what you built matters about as much as building it. And from two internships inside real production codebases, the lesson that stuck is that careful beats clever when a lot of people depend on your code. I test it, I push it through review, and I'd rather be the one who ships safely than the one who looks clever and breaks prod.

### Where graphics fits

I've loved video games my whole life, and graphics is where that love runs straight into the hard-problem stuff. It's one of the few places low-level work shows up right on the screen, so when you get it right you get to watch it run instead of reading it off a graph. That's why ray-vox, my voxel renderer, is the project I've sunk the most into lately. But it's one place the thing I love shows up, not the whole plan. The plan is to keep finding hard problems. Graphics just happens to be a really good one.

### Outside of that

I like being close to hardware. I built my PC years ago and keep tuning it, and lately I've been into small form factor builds, fitting real performance into a roughly 10-liter case. I also fell down the audio rabbit hole: EQ, calibration, measuring how speakers and headphones actually perform, and I might write my own AutoEQ-style tool. I'm in UCSC's Game Design and Art club making things in Godot. And Rust is my default when I want speed and safety at once. Most of this started as a weekend thing and stuck, which is pretty much how I end up caring about anything.

### Timeline

**High school (2020 to 2024).** Graduated from Khan Lab School. Dual-enrolled at Foothill College, taking college-level chemistry, biology, and three physics courses alongside high school. Built a CS foundation through AP CS A, robotics (FRC #6962), and a lot of independent projects. Programming lead for the robotics team, focused on control systems, simulation, and software reliability.

**Summer 2022, SWE Intern at SmugMug.** Full-time paid internship after my sophomore year of high school, working in a real production codebase in PHP, React, and Next.

**Summer 2023, SWE Intern at Flickr.** Internship after my junior year, tuning a production AWS pipeline to cut its compute cost about 92% and run 39% faster.

**University (2024 to now).** Computer science at UC Santa Cruz, going into my third year. Building systems-level projects across graphics, data, and infrastructure, and looking for a software engineering internship while I work out where to focus.
