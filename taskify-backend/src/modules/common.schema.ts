import * as z from "zod";

export const ErrorResponseZodSchema = z.object({
  ok: z.boolean(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});