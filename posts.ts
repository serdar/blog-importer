import { z } from "zod";

export const PostSchema = z.object({
   title: z.string(),
   slug: z.string().optional(),
   author: z.string().optional(),
   pubDate: z.string(),
   content: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;
