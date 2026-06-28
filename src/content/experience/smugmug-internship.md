---
title: SWE @ SmugMug
desc: Summer 2022. An 8-week full-stack internship on SmugMug's Growth team, shipping real production features in PHP, React, and Next.
tags: [php, react, next.js, full-stack, production-systems, testing, qa, jira]
kinds: [work]
image: /smugmug.png
---

### The short version

I spent 8 weeks in the summer of 2022 as a software engineering intern on SmugMug's **Growth team**, working across the stack in PHP, React, and Next. It was my first time inside a large, mature production codebase, the kind real customers are using while you're editing it.

I gave a presentation on all this at the end of the internship. Here's the deck:

<div class="slides-embed">
  <iframe
    src="https://docs.google.com/presentation/d/1v8bVOwIW-5vxacu4trtzgGgV42bHbC3ZX64MBXINYUM/embed?start=false&loop=false&delayms=3000"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
  ></iframe>
</div>

### What a real codebase is like

Before this, I'd written plenty of code, but never inside a system this big with this many people depending on it. What surprised me most was how much structure sits around the actual coding to keep it from falling over.

Every change runs through what the team called a multistage filter. You build it, it goes through pull request review, then QA, then it ships. Nothing reaches production without clearing all of it. At first that seemed like a lot of steps. By the end it made sense, because one bad change in a codebase that size can break things for a lot of people at once.

The rest of the setup pointed the same way. I had my own sandboxed SmugMug site, a private copy where I could test changes without touching anything real. Work got tracked in Jira sprints so a big team stays pointed at the right things. And the code was a mix of modern and legacy, so a chunk of the job was learning to navigate an unfamiliar codebase and change it without breaking the parts I didn't understand yet.

### What I shipped

The work itself landed in a few different places.

**Gallery engagement stats.** SmugMug shows photographers stats on their galleries, things like how many views and downloads each photo is getting. I added a daily update cadence so those numbers refresh on a schedule, and cleaned up the display so it's clear what you're looking at: labeling a window as "last 30 days" instead of just "30 days," and handling the empty states for photos with no views or downloads yet. It's a small feature, but it's a real user-facing one that I owned from start to finish.

**A 404 link in the monorepo.** There was an "include your discount code?" link in the frontend that was quietly going to a 404. I tracked down where it broke and fixed it. Tiny on its own, but a good lesson in how a small broken link can hide inside a huge codebase, and how even a one-line fix still ships through the whole review and QA pipeline.

**The PHP 8.1 upgrade.** On the backend, I worked on changes supporting SmugMug's move to PHP 8.1 and wrote my own unit tests for them. This one had real stakes. It was on the critical path, so if my piece wasn't done on time it would have held up the release. It also turned out to be a lot more involved than we first expected, which is a pattern I kept seeing: the "simple" task that quietly balloons once you're deep in a real codebase. I paired with one of the backend engineers, Cabbey, to get it across the line.

### What I took away

The through-line for me was that careful beats clever in a codebase like this. Writing the code was rarely the hard part. The skill was making changes I could be confident in: testing them, pushing them through review, and understanding how my one piece fit into a system I didn't build. That's the habit I kept, and it's how I approach engineering now.

### Thanks

A lot of people made this internship what it was. A few I owe directly:

- Hinsen, my mentor, who I worked with on the frontend
- Marisol, my manager
- Alex, on the backend and the email migration
- Cabbey, on the backend and the LESS processor
