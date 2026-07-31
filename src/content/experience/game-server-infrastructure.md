---
title: Game Server Infrastructure
desc: Self-hosted Minecraft and Factorio servers on AWS EC2, with snapshot backups and a migration to cheaper ARM hardware.
tags: [aws, linux, cloud-infrastructure, dns, docker, systems-configuration, devops]
primaryTech: [AWS, Linux]
date: "2020 - Present"
kinds: [project]
order: 3
image: /images/aws-server.png
---

### TL;DR

I run a self-managed game server on **AWS EC2** hosting a handful of Minecraft worlds and some Factorio games for me and my friends. The games are sort of beside the point. It's the most hands-on way I've found to learn cloud infrastructure, and it's where I picked up AWS, SSH, and how Linux servers actually work.

It started as a tiny box. As more people joined I had to keep sizing it up, and eventually I moved the whole thing onto cheaper **ARM hardware** (AWS Graviton). What made all of that painless was treating EC2 snapshots like a save button for the entire server.

### The setup

Instead of paying for managed game hosting, I run everything myself on a bare Linux box in the cloud. On top of it I use **Pterodactyl**, a panel that runs each game server in its own Docker container, so I can spin up a new Minecraft world or a Factorio game without them stepping on each other. I also set up a custom domain with the right DNS records so people connect to a clean address instead of a raw IP.

### Running it from the command line

The whole thing lives behind SSH. I'm in the Ubuntu command line for basically everything: editing config files in place, tailing logs to figure out why a server crashed on startup or a plugin blew up at runtime, restarting services so they come back cleanly. It's routine once you've done it a few times. Doing it on a live box that people are relying on is how I learned my way around Linux and AWS, as opposed to reading about them.

### Snapshots, scaling, and moving to ARM

EC2 lets you take a **snapshot** of a volume, which is a frozen copy of the whole disk. That turned out to be more useful than I expected.

For backups it's obvious: snapshot the server, and if something breaks, roll the whole thing back to a moment in time. The better use was changing hardware. When I needed a bigger machine, I'd snapshot the server, launch a fresh instance from that snapshot, and point the domain at it. The world, the configs, the plugins, all of it comes along, and the swap takes minutes instead of a painful manual migration.

That's also what made the move to ARM low-risk. I started on a small instance and kept sizing up as more people joined. Eventually I moved the whole server onto AWS Graviton, which runs on ARM and costs less for the same performance. Switching CPU architectures sounds scary and with the snapshot workflow it was just another swap. I like ARM a lot, so that one was satisfying.

### The game-server side

Underneath the infrastructure, the servers themselves take real fiddling, especially Minecraft. A busy world runs dozens of plugins and they interact in annoying ways. A lot of the work is getting them to play nice: chasing down which plugin is causing a crash, dealing with version mismatches every time something updates, and tuning settings so the server stays smooth under load.

The Discord integration was the most fun part. In-game chat is synced to a Discord server through a plugin and a bot, so messages flow both ways. You can talk to people in the game from Discord and the other way around, and roles and permissions stay lined up across both. Getting that working meant wiring up authentication and passing events back and forth without things getting dropped or duplicated. It still occasionally duplicates things.

### Why I keep it running

This is the closest thing I've had to a real ops job. It's a live system with actual users, so I can't break it and walk away. I have to keep it up, back it up, grow it when more people show up, and sometimes re-architect it without anyone losing their world.

Most of what I know about AWS, SSH, and running Linux in the cloud came from keeping this thing alive.
