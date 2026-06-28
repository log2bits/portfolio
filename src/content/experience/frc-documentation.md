---
title: FRC Technical Documentation
desc: A from-scratch teaching wiki that explains the team's hardest robotics systems from first principles, so the knowledge survives after I graduate.
tags: [documentation, technical-writing, docusaurus, robotics, systems-engineering, knowledge-transfer]
kinds: [project, leadership]
order: 11
image: /frc-docs.png
---

### The short version

I was doing most of the programming for our FRC team, which meant when I graduated, a huge amount of knowledge was going to walk out the door with me. So I built a wiki that teaches the team's hardest systems from first principles: control theory, swerve drive, sensors, telemetry, and simulation. It's a real website, built so people can learn from it years from now, not a pile of reference notes. [You can read it here.](https://6962-technical-wiki.vercel.app/paper)

### Why it needed to exist

By my senior year I'd become the team's single point of failure on software. I'd written most of the codebase and learned most of the hard concepts on my own, and almost none of it was written down. The FRC resources that do exist are scattered, often out of date, and usually assume you already know a lot, which is a rough wall for a new student. Most people just fall back to trial and error. I wanted something better.

### Finding the right tool, which took a few tries

Getting the format right was its own little project. I started with slides plus a recorded walkthrough, but that's miserable if you just want one specific topic, since you have to scrub through everything to find it. I tried Slidev, then Obsidian, which is great for writing in markdown but won't host to a website for free. I finally landed on **Docusaurus**: free, open source, and built from the ground up to be a real website. Then I spent a while customizing the layout and theme to fit what I wanted.

### Structuring it to teach

The other big decision was how to organize it. My first instinct was lots of tiny pages, each on one specific thing, all linked together, so people could jump straight to what they wanted. But looking at how other teams structure their resources, I realized that's overwhelming. Dozens of pages to sift through is harder than a few that walk you through a hard concept step by step. So I split it into a handful of parts, control theory, sensors, swerve drive, telemetry, and simulation, each one building up instead of dumping facts.

### How it reads

The whole thing teaches from the ground up, with a plain example before any math. Control theory starts with balancing a pencil on your finger: your eyes measure where it is, and your brain predicts where it's going, which is feedback and feedforward without the jargon. PID gets explained by moving an elevator to a target floor. Every concept ties back to real code and to what the robot does, so it's never theory floating in a vacuum.

### What it became

This wiki turned into the backbone of how I passed things down. It's the basis for the workshops I taught new programmers, the onboarding for new members, and my senior capstone, which was a whole course on robotics programming and electronics. A lot of my last season went into mentoring Arjun, the next programming lead, so the team wouldn't have to relearn everything from scratch the moment I left.

### What I take from it

Writing this taught me as much as building any of the robots did, because you can't explain control theory clearly until you really understand it. And it's the piece of my work that outlasts me. The robots get torn down and rebuilt every year, but the knowledge in here sticks around for whoever comes next.
