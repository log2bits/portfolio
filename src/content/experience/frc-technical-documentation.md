---
title: FRC Technical Documentation
desc: A from-scratch teaching wiki that explains the team's hardest robotics systems from first principles, so the knowledge survives after I graduate.
tags: [documentation, technical-writing, docusaurus, robotics, systems-engineering, knowledge-transfer]
primaryTech: [Docusaurus]
date: "2024"
kinds: [project, leadership]
order: 11
image: /images/frc-docs.png
---

### TL;DR

By my senior year I'd become the team's single point of failure on software. I was doing most of the programming, I'd written most of the codebase, I'd learned most of the hard concepts on my own, and almost none of it was written down anywhere. When I graduated, all of that was going to walk out the door with me.

So I built a wiki that teaches the team's hardest systems from first principles: control theory, swerve drive, sensors, telemetry, and simulation. [You can read it here.](https://6962-technical-wiki.vercel.app/paper)

The FRC resources that already exist are scattered, often out of date, and usually assume you know a lot already, which is a rough wall for a new student. Most people fall back to trial and error. I wanted something better than that for whoever came after me.

### Finding the right tool, which took a few tries

Getting the format right was its own little project. I started with slides plus a recorded walkthrough, which is miserable if you want one specific topic, since you have to scrub through everything to find it. I tried Slidev, then Obsidian, which is great for writing in markdown but won't host to a website for free. I landed on **Docusaurus**: free, open source, and built from the ground up to be a real website. Then I spent a while customizing the layout and theme, probably longer than I should have.

### Structuring it to teach

My first instinct was lots of tiny pages, each on one specific thing, all linked together, so people could jump straight to what they wanted. Then I looked at how other teams structure their resources and realized that's overwhelming. Dozens of pages to sift through is harder to learn from than a few that walk you through a hard concept step by step.

So I split it into a handful of parts: control theory, sensors, swerve drive, telemetry, and simulation. Each one builds up instead of dumping facts.

### How it reads

The whole thing teaches from the ground up, with a plain example before any math. Control theory starts with balancing a pencil on your finger. Your eyes measure where it is, your brain predicts where it's going, and that's feedback and feedforward without the jargon. PID gets explained by moving an elevator to a target floor. Every concept ties back to real code and to what the robot actually does.

### What it turned into

The wiki became the backbone of how I passed things down. It's the basis for the workshops I taught new programmers, the onboarding for new members, and my senior capstone, which was a whole course on robotics programming and electronics. A lot of my last season went into mentoring Arjun, the next programming lead.

Writing it taught me as much as building any of the robots did, mostly because you can't explain control theory clearly until you actually understand it, and there were a few sections where I discovered mid-paragraph that I didn't.
