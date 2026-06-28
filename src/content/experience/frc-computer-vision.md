---
title: Computer Vision w/ Robotics
desc: Three seasons of FRC robot vision, from hand-written OpenCV to local AI, then the geometry of finding objects and the robot itself in 3D.
tags: [python, java, computer-vision, opencv, robotics, pose-estimation, apriltags]
kinds: [project, leadership]
order: 8
image: /computer-vision.webp
---

### The short version

Three seasons of vision for our FRC robot. I started as the computer vision lead, and the work kept evolving as the problems got harder. We went from hand-writing image-processing algorithms in **OpenCV**, to running a local AI model on dedicated hardware, to a different problem entirely: once you can see the object, where is it in 3D, and where are we on the field? The targets changed every year too, from round balls to cones and cubes to rings.

### The early days: hand-written OpenCV

In my first season (Rapid React, the cargo-ball game) I ran OpenCV in Java right on the roboRIO and built the classic detection pipeline by hand. Convert each frame to HSV color space, threshold for the color we wanted, clean it up with filters, find edges with Sobel and Canny, use histogram backprojection to highlight the object, and fit circles to catch the round game pieces. I also ran workshops teaching the rest of the team how image processing works, since all of this was new to us.

### Outgrowing the hardware

The roboRIO couldn't keep up with real-time vision, so we moved OpenCV off it. First to Python on a Raspberry Pi, then to a Jetson Nano for more horsepower. That mattered more the next season (Charged Up), where the targets were cones and cubes instead of round balls, which are a lot harder to pick out cleanly.

### Letting AI find the objects

Partway through that cones-and-cubes season, working with a few other FRC teams, we got a local AI model running on a **Google Coral** paired with a Limelight camera. It detected the game pieces for us, faster and more reliably than the hand-tuned color pipeline. That was a big step, but it didn't finish the job. It just moved the hard part somewhere new.

### The real problem: geometry

Knowing the object sits at some pixel in the image doesn't tell you where it is in the real world. So the focus shifted to the math: turning a detection into the object's position in 3D relative to the robot. And separately, figuring out where the robot itself is on the field, which we did with **AprilTags**. You detect the tags, refine their corners for subpixel accuracy, solve the perspective-n-point problem to recover the camera's rotation and translation, and convert that into a field position. By the last season (Crescendo, the ring game) we had multiple Limelights feeding the robot's position into everything else.

### Camera calibration, the unglamorous part

None of the pose math works without good camera calibration. Every camera distorts the image a little, so you measure the camera's intrinsic matrix and its distortion coefficients once, then undistort frames so the geometry stays honest across the whole field of view. Boring, but skip it and your position estimates quietly drift.

Some of this vision work, the cone-and-cube OpenCV detection and the AprilTag calibration code, is [on GitHub](https://github.com/log2bits/RobotX-Vision-2023).

### What I take from it

The fun of this one was watching the question change under me. It started as "can we even see the game piece," became "okay, but where exactly is it," and ended as "and where are we." Each answer just exposed the next problem, and the tools changed completely along the way, from my own OpenCV code, to a trained model, to pure geometry. Leading that across three seasons taught me both the vision side and how to hand it off so it didn't all live in my head.
