import { CreateUserDtoRequest } from "../domain/users.dto.request";
import { IUsersRepostitory } from "../domain/users.interface.repository";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { User } from "../domain/users.dto.response";
import { DrizzleService } from "../../db/drizzle.service";

export class UsersRepository implements IUsersRepostitory {
  constructor(private readonly drizzleService: DrizzleService) {}

  private get client() {
    return this.drizzleService.client;
  }

  async create({
    name,
    email,
    password,
  }: CreateUserDtoRequest): Promise<User> {
    const [createdUser] = await this.client
      .insert(usersTable)
      .values({ name, email, password })
      .returning();

    return createdUser as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.client.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    return (user as User) || null;
  }

  async fetchUsers(): Promise<User[]> {
    const users = await this.client.query.usersTable.findMany();
    return users as User[];
  }

  async updateByEmail(name: string, email: string): Promise<User> {
    const [updatedUser] = await this.client
      .update(usersTable)
      .set({ name, email })
      .where(eq(usersTable.email, email))
      .returning();

    return updatedUser as User;
  }

  async findUserDetailsById(userId: string): Promise<User> {
    const user = await this.client.query.usersTable.findFirst({
      where: eq(usersTable.user_id, userId),
    });

    if (!user) throw new Error("User not found");

    return user as User;
  }
}
