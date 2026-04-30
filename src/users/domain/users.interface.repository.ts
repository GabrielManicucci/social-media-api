import { User } from "./users.dto.response";
import { CreateUserDtoRequest } from "./users.dto.request";

export interface IUsersRepostitory {
  create: (user: CreateUserDtoRequest) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  fetchUsers: () => Promise<User[]>;
  updateByEmail: (name: string, email: string) => Promise<User>;
  findUserDetailsById: (userId: string) => Promise<User>;
}
