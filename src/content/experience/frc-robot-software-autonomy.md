---
title: FRC Robot Software & Autonomy
desc: Rebuilt our FRC robot's codebase into a modular state-machine architecture, then built dynamic autonomous and a shoot-while-moving auto-aim on top.
image: /images/pathfinding.gif
tags: [java, robotics, autonomous, state-machines, software-architecture, control-systems, leadership]
primaryTech: [Java]
date: "2022 - 2024"
kinds: [project, leadership]
order: 7
---

### TL;DR

By my second season I was the programming lead, doing something like 80 to 90% of the team's programming, and the codebase I'd inherited was a mess. Nobody on the team had heard of a state machine. So I tore it down and rebuilt it into clean, modular subsystems that coordinate through a central state machine, the kind of structure where people can work on one part without breaking the others.

That foundation is what let me build the two things I'm actually proud of: autonomous routines that plan their own paths during the match, and an auto-aim that does the projectile math to shoot on the move. Code on GitHub: [2024](https://github.com/team6962/Code-2024), [2023](https://github.com/team6962/Code-2023).

### The rebuild

The old code worked, barely, but it was tangled enough that adding anything risked breaking something else, and I was the only person who really understood it. I rebuilt it around small, self-contained subsystems, one for the intake, one for the shooter, one for the drivetrain, and so on, with a single state-machine controller sitting on top to coordinate them.

Want the robot to grab a game piece, line up, and shoot? You walk the state machine through INTAKE, then AIM, then SHOOT, and each subsystem handles its own part. That turned the codebase into something the rest of the team could work in.

### Autonomous that thinks for itself

The first 15 seconds of an FRC match are fully autonomous, no driver. Most teams pre-program one fixed path. Ours doesn't. Before the match, the operator queues up which game pieces to go after, and during those 15 seconds the robot works out the route on the fly: it drives to each one, dodges the other pieces and obstacles in the way, picks it up, and shoots.

![Real-time pathfinding around obstacles, tested in simulation](/images/pathfinding.gif)

Doing it dynamically is the whole point, because it plays well with any alliance partner. Whatever the two other robots on your alliance decide to do, ours adapts its plan instead of running a script that assumes everyone cooperates.

### Shooting while moving

For the ring game (Crescendo), the robot rotates its whole body to aim at the goal and the software handles the rest. Given where the goal is and where the robot is, it solves the projectile-motion equations to find the exact flywheel speed and launch angle to land the shot.

The hard part is that the robot is usually moving, so it also has to factor in its own velocity, aiming at where it needs to be rather than where it currently is. That's what lets it shoot accurately without stopping first. All of it runs off the odometry from the drivetrain and updates every loop.

### Two seasons later

I took this team from a tangled codebase with no real architecture to a robot that plans its own autonomous and aims itself while moving. There were smaller wins along the way, like using a new IMU to auto-balance the robot on the charge-station platform in the 2023 game, which took one weekend and worked almost immediately, unlike everything else here.

None of this was the team's idea of normal, and that was sort of the point. I wanted to leave behind a codebase and a set of capabilities the team could keep building on after I graduated.
