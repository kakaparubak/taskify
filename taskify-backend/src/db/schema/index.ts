import { defineRelations } from "drizzle-orm";
import { users } from "./users";
import { tasks } from "./tasks";
import { refreshTokens } from "./refreshTokens";

export const relations = defineRelations({ users, tasks, refreshTokens }, (r) => ({
  users: {
    tasks: r.many.tasks({
      from: r.users.id,
      to: r.tasks.userId,
    }),
    refreshTokens: r.many.refreshTokens({
      from: r.users.id,
      to: r.refreshTokens.userId
    })
  },
  tasks: {
    user: r.one.users({
      from: r.tasks.userId,
      to: r.users.id,
    }),
  },
  refreshTokens: {
    user: r.one.users({
      from: r.refreshTokens.userId,
      to: r.users.id
    })
  }
}));

export * from "./users"
export * from "./tasks"
export * from "./refreshTokens"