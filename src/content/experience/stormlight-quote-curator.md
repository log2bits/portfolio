---
title: Stormlight Quote Curator
desc: A new-tab page that shows a random great line from the Stormlight Archive, curated out of the full series by a very picky LLM.
tags: [python, llm, prompt-engineering, openai, batch-processing, data-pipeline]
primaryTech: [Python, OpenAI]
date: "2025"
kinds: [project]
order: 14
image: /images/stormlight.png
---

### TL;DR

I wanted my browser's new-tab page to show a random great quote from the Stormlight Archive, the Brandon Sanderson series. This sounds like a five-minute project and it wasn't.

Showing a quote on a page is trivial. The actual problem was getting a computer to decide which lines out of thousands of pages are worth showing, and that turned into a prompt-engineering problem: teaching a small model to have taste, and to throw out almost everything.

Here's the website: https://storm-tab.vercel.app/

### The boring first step

Before any of the interesting part, I had to get the books into clean plain text a program could read. That was more work than I expected and none of it is worth writing up. I mention it only because "get the text" was a real chunk of the project rather than a given.

### Where most of the work went

My first attempt was the obvious one: hand the model a chunk of text and ask for the good quotes. Useless. The model is desperate to be helpful, so it handed back dozens of "quotes" per chapter and almost none were any good. Internal narration that isn't even dialogue. Half sentences. Bland filler. Nice-sounding lines that turned out to be said by some guard who never shows up again.

### Teaching the model to say no

The fix was to make the prompt ruthless. I told it to act like a picky curator choosing lines for a "best of" wall, and to assume that 90% of the time there's nothing worth keeping. Then I gave it rules to back that up:

- A handful of gold-standard example quotes, so it had a concrete bar to measure against.
- A hard list of which characters a line can even be credited to. If it couldn't pin the line on a named, important character, reject it.
- Reject filters for the usual junk: internal thoughts, logistics and politics, lines too short to stand on their own, and anything that would look out of place on a poster.
- If it wasn't sure who said a line, return nothing rather than guess.

Once the model was allowed, and then actively encouraged, to reject almost everything, what survived was good. Flipping its default from "find me something" to "find me nothing unless it's great" did most of the work. The 90% figure was arbitrary, by the way. I picked it because it sounded aggressive and never went back to tune it.

### Doing it across the whole series

These books are enormous, so once you chop them into chunks you're looking at thousands of requests. Sending those one at a time would be slow and pricey, so I used OpenAI's batch API: you upload one big file of requests, it works through them within a day, and it costs about half as much. I don't care if it takes a few hours.

The script handles the tedious parts. It splits each book into roughly 1,000-word chunks with a little overlap, so a quote can't get sliced in half at a boundary. It cancels any old batches still running so they don't pile up, uploads everything, waits, and merges all the results into a single file the new-tab page reads from.

### The part that wasn't code

I spent almost no time on the new-tab page and almost all of it convincing a people-pleasing model to be a harsh critic. That's been the pattern with most LLM work I've done since. Getting a model to do something is usually easy. Getting it to stop doing too much is where the time goes.
