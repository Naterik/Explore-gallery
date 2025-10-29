import z from "zod";

export const Photo = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string(),
  thumbnailUrl: z.string(),
  albumId: z.number(),
});

export type IPhoto = z.infer<typeof Photo>;
