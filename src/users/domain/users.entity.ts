import { usersTable } from "../../db/schema";

export type UserEntity = typeof usersTable.$inferSelect;
