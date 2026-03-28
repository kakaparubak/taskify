import { password } from "bun";
import * as z from "zod";

const userLogin = {
  email: z.email(),
  password: z.string(),
};

const userPasswordHash = {
  passwordHash: z.string(),
};

const userName = {
  firstName: z.string().max(64),
  lastName: z.string().max(64),
};

const userId = {
  id: z.string(),
};

export const UserZodSchema = z.object({
  ...userLogin,
  ...userName,
  ...userPasswordHash,
});

export const UserIdZodSchema = z.object({
  ...userId,
});

export const UserRegisterZodSchema = z.object({
  ...userLogin,
  ...userName,
});

export const UserLoginZodSchema = z.object({
  ...userLogin,
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

export const DeleteUserResponseZodSchema = z.object({
  ok: z.boolean(),
  data: z.object(),
});

export type UserIdSchema = z.infer<typeof UserIdZodSchema>;
export type UserRegisterSchema = z.infer<typeof UserRegisterZodSchema>;
export type UserLoginSchema = z.infer<typeof UserLoginZodSchema>;
export type UserSchema = z.infer<typeof UserZodSchema>;
