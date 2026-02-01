import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
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
            url: z.string().url(),
          }),
        })
      )
      .optional(),
  }),
});

const featuredBlog = defineCollection({
  type: "content",
  schema: z.object({
    "featured-post": z.string(),
  }),
});

const employees = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    position: z.string(),
    pronouns: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    photo: z.string(),
    "accreditation-images": z.array(z.string()).optional(),
  }),
});

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.string(),
    "accreditation-images": z.array(z.string()).optional(),
  }),
});

const testimonials = defineCollection({ type: "content" });

export const collections = {
  blog,
  "featured-blog": featuredBlog,
  employees,
  services,
  testimonials,
};