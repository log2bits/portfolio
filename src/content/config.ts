import { defineCollection, z } from "astro:content";

const experience = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    desc: z.string(),

    // Path relative to /public, e.g. "/diagram.png".
    image: z.string().optional(),

    kinds: z.array(z.enum(["work", "project", "leadership"])).default(["project"]),

    // Lower = earlier on the home grid. Unset entries fall to the end.
    order: z.number().default(9999),

    resume: z.boolean().default(false),

    // Forces which sections an entry appears in. If unset, placed by priority.
    showIn: z.array(z.enum(["work", "project", "leadership"])).optional(),

    tags: z.array(z.string()).default([]),

    // Primary language(s) / framework(s) shown as a neutral bubble on the home card.
    primaryTech: z.array(z.string()).default([]),

    // Free-form date string shown on the home card (e.g. "Summer 2023", "2024 – present").
    date: z.string().optional(),

    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().url(),
        })
      )
      .optional(),
  }),
});

export const collections = { experience };
