---
title: r/place Analysis
desc: Mining Reddit's r/place pixel canvas with Python to surface untouched pixels, hidden Among Us crewmates, and the real images under the noise.
image: /r-place-statistics.png
tags: [python, data-analysis, visualization, large-datasets, statistics]
primaryTech: [Python]
date: "2022"
kinds: [project]
order: 6
---

### The short version

r/place was a giant shared canvas on Reddit where millions of people placed one colored pixel at a time, with no one in charge, constantly painting over each other. I took the full history of every pixel placement and ran it through Python to pull real structure out of the chaos. The best part: when you average the canvas over time, the constant vandalism smooths away and the picture people were trying to make shows back up. The version I made of the Canadian flag doing this hit **45,000+ upvotes** on Reddit.

### The data

Every entry in the dataset is one pixel placement: where it went (x, y), what color, and when. Simple on its own. The catch is there are a lot of them, and a single pixel might get painted over hundreds of times. So before any analysis, I had to reconstruct what the whole canvas looked like at any moment, and track how each pixel changed across the entire event. Getting that to run without choking on the size was most of the upfront work.

### Pixels nobody ever touched

The first thing I looked for was pixels that never changed once, start to finish. Out of the entire canvas, only **3,966** stayed completely untouched the whole event.

![Pixels that stayed unchanged for the entire event](/r-place-untouched.png)

They mostly show up in two kinds of places: spots people coordinated hard to protect, and out-of-the-way corners nobody cared enough to mess with. It's a neat way to see where stability comes from on a canvas where almost everything is a fight.

### Hidden crewmates

If you color the canvas by how often each pixel changed instead of by its final color, stuff appears that you'd never catch while it was live.

![Hidden low-activity patterns across the canvas](/r-place-crewmates.png)

All over the place there are little figures tucked into quiet regions, the standout being a bunch of hidden **Among Us crewmates**. People kept them alive with slow, coordinated edits in low-traffic spots, so they stayed hidden in plain sight until you look at the canvas this way.

### Full analysis + Heatmap

I also tried generating a heatmap where most of the edits occured. Here's that, plus some more statistics:

![The r/place canvas averaged over time](/r-place-statistics.png)

### The Canadian flag

A great example of where averaging chaos pays off is the canadian flag:

![The Canada section of the canvas, averaged over time](/r-place-canada.png)

Live, that area was a constant mess of edits and people trying to deface it. But averaged over time, the flag people were defending snaps right into focus, with the vandalism washed out. I posted this one and it took off, [over 45,000 upvotes](https://www.reddit.com/r/place/comments/u10dpg/canada_looking_nice_when_you_average_the_pixels/). It's the clearest proof of the whole idea: with enough data, plain averaging can recover what something was supposed to look like even when it was under constant attack.

### What I take from it

The thing I like about this project is how simple the winning move was. No fancy model, just counting how often pixels change and averaging them over time, run carefully over a dataset big enough that you have to think about how you touch it. And it pulled out things nobody could see live: the pixels that never moved, the hidden figures, the real images under the noise. That's the whole lesson for me. A lot of structure is sitting in messy real-world data if you pick the right simple thing to measure.
