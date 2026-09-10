---
title: ray-vox
desc: A fully ray traced voxel engine in Rust and WebGPU. Its format packs a scene smaller than a gzipped copy of the source file, and the GPU renders it directly with no unpacking.
tags: [rust, webgpu, graphics, rendering, voxels, data-structures, gpu]
primaryTech: [Rust, WebGPU]
date: "2026"
kinds: [project]
image: /images/rvox-heatmap.png
order: 0
---

### TL;DR

I built ray-vox to be a fully ray traced voxel engine written in Rust and WebGPU. It's got clever data structures, an importer, and a WGSL shader that draws it to the screen. You can see it here rendering this model at a few hundred FPS, and the [code is on GitHub](https://github.com/log2bits/ray-vox).

![castle.vox as the shader actually paints it](/images/rvox-render.png)

That's 22 million voxels in one fragment shader. There's no rasterization, and no hardware ray tracing. Each pixel fires a ray, the ray skips over big empty regions in single steps, and the pixel takes the color of whatever it hits first. No lighting yet, so those are raw voxel colors.

I stopped here on purpose. I wanted a structure that's small and fast to trace at the same time, and I got that. There's a long list of stuff I'd still like to add and I'll get to some of it eventually.

### Smaller than the file it came from

This is the result I'm happiest with. I grabbed the castle model from Teardown, an 84 MB MagicaVoxel file with 22 million voxels, and loaded it into my format. It came out to 15.3 MB.

| Format                          |    Size | Can the GPU render it directly? |
|:--------------------------------|--------:|:-------------------------------:|
| MagicaVoxel `.vox` (the source) | 84.1 MB |               no                |
| `.vox` + gzip -9                | 34.4 MB |               no                |
| ray-vox `.rvox` (this project)  | 15.3 MB |               yes               |
| `.rvox` + gzip -9               |  6.6 MB |               no                |

So 5.5x smaller than the original, and smaller than a gzipped copy of it, which I didn't expect.

Size is the less interesting half though. Every other row in that table needs processing before anything can render it. A gzip file needs decompression before you can do anything useful with it. The raw `.vox` is an authoring format, so you'd have to parse it and build a spatial index before a shader could use it. My 15.3 MB is what the GPU actually reads. Uploading it is pretty much a straight copy into a couple of buffers, and the shader walks the same bitpacked tree directly.

It also doesn't have a color limit. MagicaVoxel caps the whole scene at 256 colors and that's that. In ray-vox every chunk carries its own little palette and only pays for the colors it uses, so a plain chunk collapses to almost nothing. That's why it beats `.vox` even though `.vox` already does palette indexing.

### Why I rolled my own

A voxel engine wants three things that fight each other. Small in memory, fast for rays to walk through, and quick to edit when the world changes. Most approaches give you one or two and drop the third. Compress hard and traversal gets slow. Make traversal fast and memory balloons. I wanted all three, so I designed for that instead of picking.

### The dead ends

Getting there took a couple of wrong turns.

My first idea was one giant sparse tree over the whole world. That died fast. Editing anything would mean rebuilding the entire tree and shipping it back to the GPU, which is hopeless for a world you want to change. So I broke the world into chunks, and now an edit only touches the chunk it lands in.

I picked chunks 256 voxels on a side because the number felt right. Later I realized it had handed me something I like. At that size the two offsets a node keeps to find its children pack into one 32-bit word with nothing left over, 13 bits for one and 19 for the other. There's a compile-time check that fails if I ever break that. It felt like the structure wanted to be built this way, though I'll admit I got lucky.

The clipmap took a couple tries too. That's what would let the world hold several levels of detail at once. I first tried making it another tree, with chunks hanging off it as leaves at any level, and that wrecks ray tracing. The stack a ray carries to remember its ancestors would have to be enormous. So I went back to a plain clipmap and stole the sparse trick from the chunk trees. Flat grid, one big bitmask marking what's occupied, and a ray can march through that quickly.

### How it gets so small

A few things stack up. It's sparse, so empty space is free, which matters because most of a voxel world is air. Identical regions get stored once and shared everywhere they show up, so a wall that repeats across the castle is one copy. Every number is packed to the exact bits it needs. And each chunk has that little palette, so the busy inner loop only touches tiny indices instead of full colors.

The part I'm proudest of is that there are no per-cell pointers. Normally a tree keeps a pointer at every branch saying where its children live, and those eat a ton of space. Instead I keep a couple of bitmasks per node and work out where a child lives by counting the set bits before it. The position falls out of arithmetic, so there are no pointers to store. That alone is a big chunk of why the castle fits in 15.3 MB.

The extreme case is a solid shape. A filled sphere of 8.8 million voxels fits in 197 KB, around 175x smaller than storing a number per voxel. A uniform region collapses into one filled cell on a parent node instead of a real subtree. So it never spends a byte describing the inside of something that's all one material.

### You can't trace a ray through a zip file

![A ray skipping empty regions and refining into populated ones on a 2D version of the tree](/images/rvox-traversal.png)

The structure that makes the castle small is the same thing a ray walks to find what it hits. In that diagram a ray crosses a 2D version of the tree. Green cells are big empty regions it clears in one step at their own scale. Blue cells are where it drops down for a closer look. The numbers are loop iterations rather than voxels crossed, and one iteration can cross a whole empty subtree. The 3D shader does the same thing.

Editing works the same way. An edit knows how big it is in the world, so dropping a sphere the size of a planet far away barely costs anything. It only gets checked against the coarse chunks it touches. A compressor can make bytes smaller, but you can't trace a ray through a zip file.

### Where the rays spend their time

Now that it renders I can watch the structure work. Here's the same scene with each pixel colored by how many times its ray had to read memory. Dark is cheap, bright is expensive.

![Memory reads per ray, dark is cheap and bright is expensive](/images/rvox-heatmap.png)

Pretty much what I hoped for. The dark areas are rays that either miss everything or hit a big uniform chunk and resolve in one to three reads. The bright orange edges are grazing rays sliding along a silhouette. Those have to go deep into the tree and step across a lot of cell boundaries before they hit or slip past. Foliage lights up for the same reason. A tree is a mess of tiny scattered voxels, so a ray picks its way through with lots of little steps. Anywhere the frame stays cool, the structure is doing its job.

I didn't tune for any of this. It's just what the structure does, which was nice to see.

### Build times

Baking an edit into a chunk runs at a couple billion voxels a second. Dropping that sphere of 8.8 million voxels into an empty chunk takes about 3 ms, since a big uniform fill collapses without visiting every voxel. Importing the whole castle, scene graph and rotations and all, takes about 0.7 seconds. Loading it back from disk takes 2.3 ms. Disk bandwidth is the limit there, not the loader.

### Built for the GPU

I designed this for the GPU rather than porting something onto it. The way the data sits on disk matches the way it sits in GPU memory, so uploading is close to a straight copy with no conversion step. The code that reads a node avoids branches where it can, which keeps it fast when a whole group of GPU threads walks the structure together. A lot of these choices only make sense once you're thinking about how a GPU fetches memory, and working that out was most of the fun.

### Where it stands

The data structure, the importer, and the tracer are done, and those were the parts I wanted to finish. Everything past this is stuff I'd enjoy building but didn't need to call this real.

The big one is lighting. I've worked out on paper how it would go. A per-face lighting cache, progressive global illumination that converges over a bunch of frames, sun shadows, and emissive lights it finds on its own. None of it is built.

After that I'd want the clipmap, so the world can grow without bound and far-off chunks stay cheap. Then a small PBR material table for metal and glass and fog, and more import formats like Minecraft and glTF. That's roughly the order if I come back to it.

This is the project that pointed me at graphics. It sits right where I like to be, low level enough that every bit and every cache line matters, but aimed at something you get to look at.
