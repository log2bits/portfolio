---
title: SWE @ Flickr
desc: Summer 2023. Tuned a production AWS Lambda pipeline to cut compute cost 92% and run 39% faster.
tags: [python, aws, cloud-computing, performance-optimization, distributed-systems, cost-modeling, production-systems]
primaryTech: [Python, AWS]
date: Summer 2023
kinds: [work]
order: 5
image: /flickr.png
---

### The short version

The summer I interned at Flickr, I spent most of it tuning one AWS Lambda workflow until it ran faster and cost a fraction of what it used to. Same jobs, same output, way less money.

- Cost: down 91.79%
- Throughput: up 38.5%

And this wasn't a toy. The pipeline runs in production on a library of billions of photos. So the savings are real, and they keep adding up every day it runs.

### What is AWS Lambda?

Lambda is AWS's service for small jobs that run on demand. You give it a function, it runs that function whenever something triggers it, and you only pay for the time it's actually running.

### What Flickr uses it for

Flickr is a photo-sharing site, owned by Awesome, that hosts around 10 billion photos from over 100 million people. Lambda shows up all over their stack, but I focused on one project called **Wolverine**.

Wolverine repairs photos. When an image gets corrupted or breaks, Wolverine is what fixes it. It's a core part of the codebase and it runs constantly, so shaving a little off each job turns into a big number fast.

### The problem

When you set up a Lambda function you pick two things: how much RAM it gets, and how many threads it runs. RAM is the working memory. Threads decide how many jobs run at once, so more threads means more work happening in parallel.

Both of these change how fast and how expensive the function is. And the pricing is where it gets pretty interesting.

Lambda bills you in **GB-seconds**, which is just the RAM you allocate times how long the function runs:

```text
Cost = RAM (in GB) * runtime (in seconds)
```

Now watch what each knob does:

More RAM costs more per second. But more RAM also makes the function faster, which means fewer seconds. So bumping RAM up can actually make a job cheaper.

More threads finish the batch faster because more jobs run at once. But more threads need more RAM, which costs more per second, which also makes things faster, which can make it cheaper again.

So both knobs push cost up and down at the same time. That means there's a sweet spot for RAM and a sweet spot for threads, and you can't read either one off the AWS docs. You have to go measure it.

### How I found it

The method I used was essentially to step the thread count up one notch at a time, and for each step, hunt for the RAM number that ran best.

To get honest numbers I ran controlled batches of real Wolverine jobs and profiled them with Splunk. For each batch, Splunk gave me three things: the median job time, the longest job time, and the total time for the whole batch. I dropped all of it into a Google Sheet and computed the stats I cared about:

```text
Worst Jobs / Sec    = Threads / Longest Job Time
Median Jobs / Sec   = Threads / Median Job Time
Avg Jobs / Sec      = Batch Size / Total Elapsed Time
Jobs / Sec / Thread = Batch Size / Total Time / Threads
Jobs / Sec / CPU    = Batch Size / Total Time / vCPUs
Cost / Job          = (RAM in GB * Total Time) / Batch Size
```

One thing got in the way. Lambda scales your virtual CPUs based on how much RAM you give it, but Amazon doesn't hand you the exact ratio. And I needed it for the Jobs / Sec / CPU number. So I measured CPU behavior across a range of RAM settings and ran a linear regression to pull the ratio out myself.

<div class="chart-embed">
  <iframe
    src="https://docs.google.com/spreadsheets/d/e/2CAIWO3emm4ezc2ToWGwf8oCWMToGTmjPbBaoddBsn8GGYyszSrJLmvx6alOAwCvtjtZs2ZBBfCf3oKo7uFg/gviz/chartiframe?authuser=1&autosize=true&oid=1536532312&resourcekey"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

After that it was just running the configs. A few dozen Lambdas, every result logged in the sheet below.

<div class="sheet-embed">
  <iframe
    src="https://docs.google.com/spreadsheets/u/1/d/19H1BDZkCQqz7b8ipQNAje68PYwAAiDyk0z8sUmZMxCk/htmlembed?gid=225999173&rm=minimal"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

### The result

After working through all of it, the config that won was:

- 4 threads
- 480 MB of RAM

That setting gave the lowest cost per job while keeping throughput high and tail latency steady. Next to where Wolverine started, it cut compute cost by 91.79% and pushed performance up 38.5%.

### What it taught me

The fun part is that the obvious moves were both wrong. Just crank the RAM, or just add more threads, and you miss it in either direction. The cheapest config and the fastest config landed close to the same place, but I only found that spot because I had real measurements instead of guesses. Cloud pricing tucks a lot of real hardware behavior behind two little sliders, and the only way to find the right setting is to go look.
