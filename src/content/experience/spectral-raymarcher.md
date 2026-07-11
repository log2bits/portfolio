---
title: Spectral Raymarcher
desc: A physically based diamond in a single GLSL shader, splitting white light into 256 wavelengths at one sample per pixel with no denoising, by hiding the noise in an ordered dither.
tags: [graphics, shaders, glsl, raytracing, rendering, spectral, dispersion, dithering, color-theory, gpu]
primaryTech: [GLSL]
date: "2026"
kinds: [project]
order: 1
image: /images/spectral-gem.png
---

### The short version

This is a spinning diamond that renders one wavelength of light per pixel and still comes out looking like a full-color gem. It's one GLSL shader, it runs in real time, and it never averages anything, not across frames, not across neighboring pixels. That last part is the whole trick, and it's what most of this writeup is about.

<iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/sXjXDd?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>

Link: [https://www.shadertoy.com/view/sXjXDd](https://www.shadertoy.com/view/sXjXDd)

A diamond is a fun thing to render because almost none of the light you see went straight through it. Light bends on the way in, bounces around inside off the facets a bunch of times, then bends again on the way out, and every color bends by a slightly different amount. That last bit is dispersion, the reason a diamond throws rainbows. Doing it properly usually means tracing a ton of rays and letting the noise average out, which is slow. This one gets there a different way.

### One sample per pixel

Here's the problem with doing spectral rendering the normal way. Real dispersion means every wavelength takes a slightly different path through the stone, so to get the color right you'd trace red, then orange, then yellow, hundreds of wavelengths, and average them. A path tracer fakes that by picking a random wavelength each sample and averaging thousands of samples over time. It works, but it's noisy until it converges, and it can't run clean at one sample per pixel. You have to sit and wait for it to settle.

So I stopped picking wavelengths at random and started picking them on a schedule.

Every pixel pulls a value from a 16 by 16 Bayer dither pattern, so there are 256 different values tiled across the screen, and that value picks which wavelength the pixel traces. One pixel traces deep red, the pixel next to it orange, the next one green, all laid out in the ordered Bayer pattern. Each pixel is a single pure color. But step back and your eye blends the neighborhood, and the blend of all those wavelengths is white. The averaging still happens, it just happens in your eye and on your monitor instead of in an accumulation buffer.

That's the whole idea. A normal spectral renderer converges over time; this one is already converged in space, because the dither guarantees every little neighborhood covers the spectrum evenly. At one sample per pixel you get 256 wavelengths across the image, deterministic, no waiting. Bump it to two and the whites clean up and you're covering something like 256x256 wavelength combinations. It's cheap because the hard part isn't being computed, it's being arranged.

### The shape is just planes

It started life as a raymarcher, which is where the "ray" in the name comes from. But the shape is an icosahedron, and an icosahedron is nothing but 20 flat faces, which makes it the overlap of 20 flat cuts through space. When your shape is just flat planes, you don't have to march toward it one careful step at a time. You can solve for exactly where a ray crosses each plane and be done.

The 20 faces come out of the golden ratio. The directions the faces point are all sign flips of four base directions built from the golden ratio, the number that shows up whenever something has fivefold symmetry, and an icosahedron is about as fivefold-symmetric as a shape gets. So the code carries four directions, flips their signs eight ways each to get all the faces, and to find where a ray enters and exits the stone it just intersects the ray with every face and keeps the right ones. Entry is the last plane you cross going in, exit is the first one going out. No marching, no stepping, no missing the surface at a glancing angle. Exact.

That also hands you the surface normal for free. The face a point sits on is just whichever face direction it lines up with most, so there's no need to sample the shape in six directions to guess which way the surface faces, the way a raymarcher has to. You already know.

### Light that never gets averaged

Inside the stone, every time a ray hits a facet it splits. Some of the light bounces back in, some passes through and leaves, and how much goes each way is set by Fresnel's equations and depends on the angle. A path tracer flips a weighted coin at each bounce, follows one path, and averages a thousand of those coin flips to land on the real ratio. Which is, again, noisy until it converges.

This one doesn't flip a coin. At each facet it does both. It takes the fraction of light that escapes right then, sends it out to sample whatever's around it, and adds that in. Then it keeps the fraction that stayed inside, follows only that reflected ray onward, and does the same thing at the next facet. It carries a running number for how much light is still bouncing around, and every bounce peels off the part that leaks out.

The reason this works in one ray instead of a branching tree is that the escaping light doesn't need to be traced, it just leaves and reads whatever's out there. Only the reflected part keeps going, and that's a single chain. So you get the exact energy split at every bounce with zero noise and no coin flips to average out, using the real dielectric Fresnel equations rather than the cheap approximation everyone reaches for.

### Real prism colors

Turning a wavelength into a color on screen is its own little rabbit hole, and getting it wrong tints the whole gem. A single wavelength, say 500 nanometers, has a real color to a human eye, and that mapping is a measured, standardized thing called the CIE color matching functions. The shader uses a compact math fit of those curves to go from wavelength to the eye's raw response, then a matrix to turn that into the red, green, and blue your monitor speaks.

The part I had to get right is white. If you sample a bunch of wavelengths evenly and add up their colors you'd hope for white, but you don't get it, because the curves aren't balanced evenly across the three channels. So I pre-scale the matrix so an even spread of all wavelengths lands exactly on white. That one adjustment is why a flat-lit facet reads as clean white instead of a muddy yellow, and it holds no matter how many samples per pixel you throw at it. The white point doesn't drift when you change the quality setting.

### Why the faces are flat

I tried to make it fancier and it taught me why the flat shape was the right call all along.

The whole one-sample-per-pixel thing quietly depends on flat faces, and I didn't fully see that until I broke it. I tried a torus, a rounded box, a squircle, all smooth curved shapes. They all did the same thing: the flat parts stayed clean, and the curved parts exploded into colored static. I chased that noise for a while assuming it was a bug in my math. It wasn't.

A curved surface at diamond's index of refraction acts like a lens. It focuses rays hard, so two rays that started one pixel apart can end up somewhere completely different after a few bounces. That means neighboring pixels genuinely have wildly different brightness, and a single sample per pixel can't capture something that changes that fast, so it shows up as speckle. Dropping the index of refraction down toward plain glass calmed it right down, which confirmed it. It's not a bug, it's real physics that just needs a lot of samples to resolve, which is exactly the thing this whole approach is built to avoid.

Flat faces don't focus light. Parallel rays going in stay parallel-ish, so a pixel and its neighbor stay similar, so one sample is enough. The icosahedron wasn't just a nice-looking choice. Flatness is load-bearing. The clean single-sample result and the faceted shape are the same decision.

### The small stuff

A few things that didn't need their own section. The camera sits far back with a long lens, which is how people actually photograph jewelry, because it flattens the perspective and keeps the whole stone in a tight frame. The background is pure black, which is also the jewelry-photo move, it makes the stone pop.

The gem spins on its own on three axes at once, at speeds set by powers of the golden ratio so the rates never line up, which means the tumble never repeats. And you can grab it. Click and drag rotates it like a turntable, left-right spins it, up-down tips it toward you, and it goes back to spinning on its own when you let go.

All the tracing happens in the gem's own frame. Instead of rotating the stone, the shader rotates the camera ray and the light into the stone's coordinates once, up front, and traces against a gem that's sitting still. Small thing, but it means the spin costs almost nothing.

### What I take from it

This one turned into a long argument with myself about noise. Every fancy feature I wanted, dispersion, internal reflections, curved shapes, was really a question of where the noise was allowed to live. The answer I kept landing on: if you refuse to average over time or space, the noise has to go somewhere, so the whole craft is arranging things so it lands somewhere you can't see. The Bayer dither hides it in a pattern your eye blends away. The deterministic Fresnel takes it out of the light bounces entirely. And the flat faces sidestep the one place, curved focusing, where it can't be hidden at all.

I came in wanting a pretty diamond and left understanding that it looks clean because of a hundred small decisions to not average anything, and that the shape I ended on was the shape that made all of them possible. That's a better thing to walk away with than just the render.
