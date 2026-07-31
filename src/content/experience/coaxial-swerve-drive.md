---
title: Coaxial Swerve Drive
desc: A coaxial swerve drive software built from scratch, custom chassis, control theory, and physics simulation.
image: /images/swerve-module.png
tags: [java, robotics, control-theory, kinematics, odometry, simulation, state-estimation]
primaryTech: [Java]
date: "2023 - 2024"
kinds: [project, leadership]
order: 4
---

### TL;DR

This is the biggest project I've taken on. A coaxial swerve drive built from scratch: the custom chassis (I did the CNC, wiring, and electronics), the modules, and the entire software stack. Swerve is the most capable and the most complicated drivetrain in FRC, and our team had never attempted it. I led an off-season team, taught the workshops, and had a working prototype in a month, roughly four months ahead of what we'd planned for. About $4,000 of hardware and around 2,000 lines of code.

### What swerve is, and why it's hard

Most FRC robots drive like a tank: wheels fixed forward, turn by spinning one side faster. Swerve gives every wheel its own steering motor and its own drive motor, so the robot can move in any direction and rotate at the same time.

![Swerve translation, rotation, and combined motion](/images/diagram.png)

That's a huge advantage on the field. The control problem is brutal, and there's almost no good documentation online. Other teams publish swerve libraries and I could have used one. I built my own because FRC is supposed to be about learning and I was excited about it.

### The build

The modules came as kits that we assembled. The chassis was fully custom, designed and machined by me.

![Internal coaxial swerve gearbox](/images/gearbox.png)

Designing it meant treating the modules as real mechanical systems: gear ratios, backlash, rigidity, and where every motor and sensor mounts.

![Labeled robot chassis with electronics and modules](/images/labeled-robot-chassis.png)

### The control theory nobody on the team had

Before I led programming, the team had no concept of control theory. No PID, no feedforward, no motor or gearbox torque math. So I taught myself from scratch, the kind of thing that's usually graduate-level, and then taught it to the team.

Each wheel module runs its own tuned PID plus a feedforward model, and I seed the fast built-in encoder from an absolute one so the motor controllers can run a 1,000 Hz control loop. I also turned the current limit into a feature. Instead of guessing at a safe number, I compute the exact limit from the robot's weight and the carpet's friction, so the wheels deliver max grip without ever slipping or browning out the battery.

### Knowing where the robot is

A swerve robot is useless for autonomous if it doesn't know where it is. I fuse three sources, the wheel encoders, a gyro, and AprilTag vision, through a Kalman-filter pose estimator, which gives a position estimate good to under a centimeter. It holds up when the robot gets shoved or the wheels slip, because the filter weighs the noisy sources against each other instead of trusting any single one.

### The whole robot, simulated

The entire robot can run in a physics simulation, modeled down to the motors: real torque curves, wheel inertia, battery voltage and current draw, even brownouts. Because the simulation goes that deep, the exact same code that drives the real robot drives the simulated one, with no changes.

That mattered more than I expected it to. Time on the physical robot is the biggest bottleneck on any FRC team. One robot, fifteen people who need it. This let us write and tune code from a laptop, anywhere, months before the robot existed.

### Where the writeup lives

I showed up with a drivetrain the team had never tried and control theory they'd never used, learned all of it from scratch, and then had to teach it. The deep version, with all the math and the code, is in the wiki I built for exactly that purpose: [the technical paper](https://6962-technical-wiki.vercel.app/paper). The drivetrain code itself is [on GitHub](https://github.com/team6962/Code-2024).
