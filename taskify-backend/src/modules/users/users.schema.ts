import { password } from "bun";
import * as z from "zod";

export const UserZodSchema = z.object({
  id: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  firstName: z.string().max(64),
  lastName: z.string().max(64)
})

export const UserIdZodSchema = z.object({
  id: z.string(),
});

export const UserCreateZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  firstName: z.string().max(64),
  lastName: z.string().max(64),
});

export const UserLoginZodSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const UserResponseZodSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    id: z.string(),
    email: z.email(),
    firstName: z.string().max(64),
    lastName: z.string().max(64),
  }),
});

export type UserIdSchema = z.infer<typeof UserIdZodSchema>;
export type UserCreateSchema = z.infer<typeof UserCreateZodSchema>;
export type UserSchema = z.infer<typeof UserZodSchema>;
