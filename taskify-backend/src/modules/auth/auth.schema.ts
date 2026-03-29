import * as z from "zod";

export const AuthLoginZodSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const AuthRegisterZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  firstName: z.string().max(64),
  lastName: z.string().max(64),
});

export const AuthResponseZodSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    accessToken: z.string(),
  }),
});

export type AuthLoginSchema = z.infer<typeof AuthLoginZodSchema>
export type AuthRegisterSchema = z.infer<typeof AuthRegisterZodSchema>
export type AuthResponseSchema = z.infer<typeof AuthResponseZodSchema>