---
title: Perceptual Color Space Experiments
desc: Some fun I had messing around with OkLAB and OkLCH
tags: [color-theory, algorithms, data-structures, rust, oklab, oklch, image-processing]
kinds: [project]
image: /all_colors.png
---

I discovered oklab a while back in a desperate attempt to find a rainbow gradient that looked perceptually uniform. The standard ones you get from HSV or HSL just dont cut it. Here's a quick comparison:

![rainbow comparison](https://www.bram.us/wordpress/wp-content/uploads/2022/02/oklab-vs-hsv.png)

The top gradient is from oklab (well actually oklch, but they are from the same family). The bottom one is from HSV (hue, saturation, value).

As you can see, the oklab gradient looks much nicer. This is because our eyes perceive colors in a slightly biased way which is what perceptual color palettes are designed around.

Now one of the really hard things I wanted to try to tackle with this project is attempting to represent every single unique linear rgb color to a 4k x 4k image where every color is represented exactly once, and where all colors form a nice gradient. This turns out to be basically impossible. Even without the constraint of the image size or requiring each color to show up exactly once (and instead requiring at least one), many have tried and failed:
http://www.kindofdoon.com/2020/06/visualizing-color-space-in-2d.html

But despite this, I had a few ideas in mind. I won't bore you with the failed attempts and instead jump straight to what worked. Before all that, I'll show you what I came up with:

![all linear rgb colors](/all_colors.png)

For this algorithm I basically took 64 parts of the RGB cube, mapped them to an 8x8 image, then swapped colors around until it minimized global differences computed in oklab color space. Then I did that again for 64x64 and then 512x512 and then finally 4096x4096. Because this is heirarchical, this does global AND local minimizing.

Now I wanted to take this one step further and generate a color palette of n entries that are perceptually uniform/distinct. This can be really useful for things like image compression, color quantization, data visualization, pixel art, and much more.

I tried many different techniques and eventually landed on something I havent seen others try before. You can see what has be done/tried in the past here: https://medialab.github.io/iwanthue/theory/

What I ended up doing is starting with every single one of the 16 million linear RGB colors mapped to the oklab color space, and then I simply removed the color that was closest to its two closest neighbors and wrote that down. I repeated this process until all colors were gone and I was left with this image (read left-to-right, top-to-bottom):

![palette generator image](/palette_generator.png)

Now the reason why it has all these bands is because the algorithm first started thinning the green area since there happen to be a lot of green/cyan colors in the linear rgb color space that are perceptually very very similar to human eyes. Same deal with magenta. This shows that with a large enough color palette (around a million colors), you physically cant get a perceptually uniform palette since its fundementally constained within the linear rgb space. There just arent enough linear rgb colors that can be equally spaced that way.

Anyway, heres what a uniform 256 palette looks like, using the color organizing from the other project:

![palette generator image](/palette_256_scaled.png)

And this is the LUT for that palette:

![palette generator image](/palette_lut.png)

And a nice graph:

![graph](/distribution.png)
