---
title: Stormlight Quote Curator
desc: A new-tab page that shows a random great line from the Stormlight Archive, curated out of the full series by a very picky LLM.
tags: [python, llm, prompt-engineering, openai, batch-processing, data-pipeline]
primaryTech: [Python, OpenAI]
date: "2025"
kinds: [project]
order: 14
image: /stormlight.png
---

### The short version

I wanted my browser's new-tab page to show a random great quote from the Stormlight Archive, the Brandon Sanderson series. Sounds like a five-minute project. It wasn't. Showing a quote on a page is easy. The hard part, and the whole point, was getting a computer to pick which lines are worth showing out of thousands of pages of text. That turned into a prompt-engineering problem: teaching a small LLM to have taste, and to throw out almost everything.

Here's the website: https://storm-tab.vercel.app/

### The boring first step

Before any of the fun, I had to get the books into clean, plain text a program could read. That was more work than I expected, and none of it's interesting, so I'll spare you the details. Just know that "get the text" was a real chunk of the project, not a given.

### Where most of the work went

Once I had the text, I needed software to pull the good quotes so I didn't have to reread the whole series myself. My first attempt was the obvious one: hand the model a chunk of text and ask for the good quotes. It was useless. The model is desperate to be helpful, so it handed back dozens of "quotes" per chapter and almost none were any good. Internal narration that isn't even dialogue, half sentences, bland filler, and nice-sounding lines that turned out to be said by some guard who never shows up again.

### Teaching the model to say no

The fix was to make the prompt ruthless. I told the model to act like a picky curator choosing lines for a "best of" wall, and to assume that 90% of the time there's nothing worth keeping. Then I gave it the rules to back that up:

- A handful of gold-standard example quotes, so it had a concrete bar to measure against.
- A hard list of which characters a line can even be credited to. If it couldn't pin the line on a named, important character, reject it.
- Reject filters for the usual junk: internal thoughts, logistics and politics, lines too short to stand on their own, and anything that would look out of place on a poster.
- If it wasn't sure who said a line, return nothing rather than guess.

Once the model was allowed, even encouraged, to reject almost everything, the stuff that survived was good. The whole trick was flipping its default from "find me something" to "find me nothing, unless it's great."

### Doing it across the whole series

These books are massive, so once you chop them into chunks you're looking at thousands of requests. Sending those one at a time would be slow and pricey, so I used OpenAI's batch API: you upload one big file of requests, it works through them within a day, and it costs about half as much. I don't care if it takes a few hours to finish.

The script handles the tedious parts. It splits each book into roughly 1,000-word chunks, with a little overlap so a quote can't get sliced in half at a boundary, cancels any old batches still running so they don't pile up, uploads everything, waits, and merges all the results into a single file the new-tab page reads from.

### What I take from it

The fun of this one was realizing it wasn't really a coding problem, it was a taste problem. I spent almost no time on the new-tab page and almost all of it convincing a people-pleasing model to be a harsh critic. That's been the pattern with most LLM work I've done since: the hard part usually isn't getting the model to do something, it's getting it to stop doing too much.
