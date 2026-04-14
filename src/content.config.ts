import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    "hero-image": z.string(),
    thumbnail: z.string(),
    "accreditation-images": z.array(z.string()).optional(),
    "useful-links": z
      .array(
        z.object({
          link: z.object({
            "link-text": z.string(),
            url: z.url(),
          }),
        })
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

const featuredBlog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/featured-blog" }),
  schema: z.object({
    "featured-post": z.string(),
  }),
});

const employees = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/employees" }),
  schema: z.object({
    name: z.string(),
    position: z.string(),
    pronouns: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    photo: z.string(),
    "accreditation-images": z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    "short-description": z.string(),
    image: z.string(),
    "accreditation-images": z.array(z.string()).optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    "client-name": z.string(),
    testimonial: z.string(),
  }),
});

export const collections = {
  blog,
  "featured-blog": featuredBlog,
  employees,
  services,
  testimonials,
};