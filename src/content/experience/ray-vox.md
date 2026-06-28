---
title: ray-vox
desc: (WIP) A from-scratch ray-traced voxel renderer in Rust and WebGPU, built on a custom sparse-voxel data structure that beats zstd on size while staying directly renderable.
tags: [rust, webgpu, graphics, rendering, voxels, data-structures, gpu]
kinds: [project]
image: /rvox-compression.png
order: 0
---

### The short version

ray-vox is a voxel renderer I'm building from scratch in Rust and WebGPU, where everything is ray traced, no rasterization. It's a work in progress, and the part that's built so far is the foundation: the data structure and the architecture the renderer will run on. That's the piece I most wanted to get right, because in a voxel engine the data structure decides almost everything about how fast and how big the whole thing ends up.

Here's the result that makes me happy so far. I took the castle model from Teardown, an 84 MB voxel file, and loaded it into my format. It came out to 16 MB. For comparison, zstd, one of the best general-purpose compressors there is, only gets that same file down to about 19 MB at its most aggressive setting, and 57 MB at its default. So mine is smaller than zstd at any level, and that's the less interesting half. A zstd file is a dead blob you have to unpack before you can do anything with it. My 16 MB is the live structure the GPU walks through to draw the scene, with levels of detail built in all the way up. [Full repo, and a very deep README, here.](https://github.com/log2bits/ray-vox)

### Why a custom data structure

A voxel engine wants three things that usually pull against each other: it should be small in memory, fast to traverse for rays, and quick to edit when the world changes. Most off-the-shelf approaches give you one or two of those and give up the third. Compress hard and traversal slows down. Make traversal fast and the memory balloons. I wanted all three at once, so I designed the structure around getting them together instead of trading between them.

### A few dead ends first

Landing on a structure that does all three took a few wrong turns to find.

My first idea was one giant sparse tree covering the whole world. That died fast: editing anything would mean rebuilding the entire tree and shipping the whole thing back to the GPU, which is hopeless for a world you actually want to change. So I broke the world into chunks instead, where an edit only touches and re-uploads the one chunk it lands in.

I picked chunks 256 voxels on a side mostly because the number felt right, and only later realized it had handed me something I love. At that size, the two offsets a node keeps to find its children pack into a single 32-bit word with no room to spare, 13 bits for one and 19 for the other, and a compile-time check fails loudly if I ever break that bound. It's the kind of thing that feels like the structure wanted to be built this way.

The clipmap, which is how the world holds several levels of detail at once, took a couple of tries too. I first tried making it yet another tree with chunks hanging off it as leaves at any level, but that wrecks ray tracing, because the stack a ray carries to remember its ancestors would have to be enormous. So I went back to a plain clipmap and borrowed the sparse trick from the chunk trees: a flat grid with one big bitmask marking what's occupied, which a ray can march through quickly.

### How it gets so small

A few ideas stack up. The structure is sparse, so empty space costs nothing at all, which matters because most of a voxel world is air. Identical regions are stored once and shared everywhere they show up, so a chunk of wall that repeats across the whole castle is kept as a single copy. Every number is packed down to the exact bits it needs, and each chunk carries its own small palette of materials, so the busy inner loop only ever touches tiny indices instead of full colors.

The part I'm proudest of is that there are no per-cell pointers anywhere. Normally a tree stores a pointer at every branch saying where its children live, and those pointers eat an enormous amount of space. Instead I keep a couple of bit masks per node and work out where a child lives by counting the set bits before it. The position falls out of arithmetic, so the pointers just disappear. That alone is a big chunk of why the castle fits in 16 MB.

### It's an acceleration structure, not a zip

This is the real difference between what I built and just compressing a file. The same structure that makes the castle small is also the thing a ray walks through to find what it hits, and it has every level of detail baked in. Something far from the camera gets read at a coarse level automatically, so distant geometry is cheap with no extra work. Editing is the same story: an edit knows its own size in the world, so dropping a sphere the size of a planet far away barely costs anything, because it only ever gets evaluated against the coarse chunks it actually touches. You can't get any of that from a compressor. A zip can make bytes smaller, but you can't trace a ray through a zip.

### Built for the GPU

I designed the whole thing to live on a GPU, not just in theory. The way the data sits on disk matches the way it sits in GPU memory, so uploading it is close to a straight copy with no conversion step. The code that reads a node avoids branches wherever it can, which keeps it fast when a whole group of GPU threads is walking the structure together. A lot of these choices only make sense once you're thinking about how a GPU fetches memory, and working that out is most of what made this fun.

### Where it's going

The data structure was the part I wanted to nail before anything else, and it's largely there. The renderer itself, the ray tracing and the lighting, is the next phase, and I've already worked out a lot of how it'll go: a per-face lighting cache, progressive global illumination, that kind of thing. I'm stepping through the rendering fundamentals carefully before I build that part, because I'd rather understand it deeply than rush it.

This is the project that pointed me at graphics for real. It sits right where I like to be, low-level enough that every bit and every cache line matters, but aimed at something you'll eventually get to see on screen. That combination is exactly why I want to do this for a living.
