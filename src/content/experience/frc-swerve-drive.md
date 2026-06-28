---
title: FRC Swerve Drive
desc: A coaxial swerve drive built from scratch, custom chassis to control theory to a full physics simulation.
image: /swerve-module.png
tags: [java, robotics, control-theory, kinematics, odometry, simulation, state-estimation]
kinds: [project, leadership]
order: 4
---

### The short version

This is the biggest project I've taken on. A coaxial swerve drive built from scratch, every part of it: the custom chassis (I did the CNC, wiring, and electronics), the modules, and the entire software stack. Swerve is the most capable and the most complicated drivetrain in FRC, and our team had never attempted it. I led an off-season team, taught the workshops, and had a working prototype in a month, about four months ahead of what we expected. Roughly $4,000 of hardware and around 2,000 lines of code.

### What swerve is, and why it's hard

Most FRC robots drive like a tank: wheels fixed forward, turn by spinning one side faster. Swerve gives every wheel its own steering motor and its own drive motor, so the robot can move in any direction and rotate at the same time.

![Swerve translation, rotation, and combined motion](/diagram.png)

That's a huge advantage on the field, but the control problem is brutal, and there's almost no good documentation online. There are swerve libraries other teams publish, but I built my own, because FRC is about learning and I was really excited about it.

### The build

The modules came as kits that we assembled, but the chassis was fully custom, designed and machined by me.

![Internal coaxial swerve gearbox](/gearbox.png)

Designing it meant treating the modules as real mechanical systems, accounting for gear ratios, backlash, rigidity, and where every motor and sensor mounts, not just bolting parts together.

![Labeled robot chassis with electronics and modules](/labeled-robot-chassis.png)

### The control theory nobody on the team had

Before I led programming, the team had no concept of control theory. No PID, no feedforward, no motor or gearbox torque math. So I taught myself control theory from scratch, the kind of thing that's usually graduate-level, and then taught it to the team. Each wheel module runs its own tuned PID plus a feedforward model, and I seed the fast built-in encoder from an absolute one so the motor controllers can run a 1,000 Hz control loop. I also turned the current limit into a feature: instead of guessing, I compute the exact limit from the robot's weight and the carpet's friction, so the wheels deliver max grip without ever slipping or browning out the battery.

### Knowing where the robot is

A swerve robot is useless for autonomous if it doesn't know where it is. I fuse three sources, the wheel encoders, a gyro, and AprilTag vision, through a Kalman-filter pose estimator, which gives a position estimate good to under a centimeter. The nice part is it holds up when the robot gets shoved or the wheels slip, because the filter weighs the noisy sources against each other instead of trusting any single one.

### The whole robot, simulated

This is my favorite part. The entire robot can run in a physics simulation, modeled all the way down to the motors: real torque curves, wheel inertia, battery voltage and current draw, even brownouts. Because the simulation goes that deep, the exact same code that drives the real robot drives the simulated one, with no changes. That's a bigger deal than it sounds. Time on the physical robot is the biggest bottleneck on any FRC team, and this let us write and tune code from a laptop, anywhere, long before the robot was even built.

### What I take from it

This was me dragging the team into modern FRC. I showed up with a drivetrain they'd never tried and control theory they'd never used, learned all of it from scratch, and then taught it to the team. The deep writeup, with all the math and the code, lives in the wiki I built for exactly that reason: [the technical paper](https://6962-technical-wiki.vercel.app/paper). The drivetrain code itself is [on GitHub](https://github.com/team6962/Code-2024).
