---
title: OKLab RGB Cube Bijection
desc: All 16 million RGB colors arranged into one perceptually smooth 4K image with OkLAB, plus a generator for perceptually uniform palettes of any size.
tags: [color-theory, algorithms, data-structures, rust, oklab, oklch, image-processing]
kinds: [project]
order: 2
image: /all_colors.png
---

### The short version

This started because I wanted a rainbow gradient that looked even, and the usual ones from HSV or HSL don't. That sent me down a rabbit hole into **OkLAB**, a color space built around how human eyes actually see, and the rabbit hole turned into two projects. The first lays out all 16 million RGB colors into a single 4K image where each color appears exactly once and the whole thing reads as one smooth gradient. The second builds perceptually even color palettes of any size, and ended up teaching me something I didn't know about the limits of color itself.

![Every RGB color, exactly once, in one 4K image](/all_colors.png)

I posted this and fell into a great back-and-forth about how it works, [over on Reddit](https://www.reddit.com/r/proceduralgeneration/comments/1ughr8s/every_rgb_color_exactly_once/).

### Why OkLAB

A normal rainbow looks off because our eyes don't perceive color evenly. We're far more sensitive to differences in some regions, greens especially, than others, so a gradient that's mathematically even in HSV looks lumpy: some colors hog space and others flash past. OkLAB and its cousin OkLCH are built to correct for that bias, so even spacing in OkLAB looks even to a person. Everything in both projects measures color distance in OkLAB for that reason.

### Every color, exactly once

The goal was to put all 16 million RGB colors into a 4096x4096 image, each one used exactly once, arranged so the image flows as a smooth gradient. This is close to impossible, and plenty of people have tried and come up short even without the "exactly once" rule. I'll skip my own dead ends and explain the version that worked.

The trick is that the numbers line up. The RGB cube holds 256x256x256 colors. Slice it into 4 along each axis and you get 64 smaller cubes, and 64 is exactly an 8x8 grid. So I lay those 64 cubes onto an 8x8 image and shuffle them around to make neighbors as perceptually close as possible, measuring against a blurred copy of the image in OkLAB. I start with a wide blur, which smooths things globally, and shrink it over time, which cleans up the local detail. Then I zoom in: each of those 64 cubes splits into 64 of its own, filling an 8x8 block inside whatever pixel its parent landed on, and the shuffling repeats. Four levels of that takes me from 8x8 to 64x64 to 512x512 to the full 4096x4096, and by the end every pixel is a single color. Because a cube's children never leave the spot their parent claimed, every one of the 16 million colors shows up exactly once. It's a permutation, not a paint job.

The part I didn't see coming was the clouds. Those swirling, fractal-looking patterns weren't designed, they just fell out of the process. Squashing a 3D cube of color down onto a flat image forces compromises, and it turns out this is what they look like. The four dark corners are a smaller quirk: I do the math with wrapping, then slide the whole image so pure black sits in the top-left.

### A palette that runs into a wall

Then I wanted the opposite of all-the-colors: a small set of N colors that are as perceptually distinct from each other as possible. That's useful for color quantization, data visualization, pixel art, and similar things. The method I landed on, which I haven't seen anyone else try, is almost too simple. Drop all 16 million colors into OkLAB, then repeatedly find the color sitting closest to its two nearest neighbors and remove it, writing down the order it left in. Keep going until nothing's left, and that removal order is your answer: the colors that survive longest are the most distinct.

![The palette generator's output, read left to right, top to bottom](/palette_generator.png)

Reading the result told me something I didn't expect. The greens and cyans get thinned out first, then magenta, because linear RGB is packed with colors in those regions that look nearly identical to us. And if you push the palette big enough, around a million colors, you hit a wall: you physically can't make it perceptually even, because the linear RGB space just doesn't hold enough colors that are evenly spaced to the human eye. The algorithm doesn't only build a palette, it runs straight into a hard limit of the color space.

Here's a uniform 256-color palette it produced, laid out with the same method as the first project:

![A perceptually uniform 256-color palette](/palette_256_scaled.png)

And the lookup table for it, plus a graph of how the colors come out distributed:

![Lookup table for the 256-color palette](/palette_lut.png)
![Distribution of the palette](/distribution.png)

### What I take from it

Both halves of this started as "wouldn't it be nice to organize color perfectly," and both ran straight into the fact that color space has its own shape and its own limits. The all-colors image only works by accepting those strange emergent clouds, and the palette generator works right up until the point where the space itself runs out of room. I came in wanting a prettier gradient and left with a much better feel for why perfect color is impossible, which is somehow more satisfying than if it had just worked.
