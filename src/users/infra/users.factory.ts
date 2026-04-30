import { UsersRepository } from "./users.repository";
import { drizzleService } from "../../db/drizzle.service";
import { CreateUserUseCase } from "../application/create-user";
import { UsersService } from "../application/users.service";
import { AuthUserUseCase } from "../application/auth-user";

export function RegisterUserFactory() {
  const usersRepository = new UsersRepository(drizzleService);
  const createUserUseCase = new CreateUserUseCase(usersRepository);

  return createUserUseCase;
}

export function AuthUserFactory() {
  const usersRepository = new UsersRepository(drizzleService);
  const usersService = new UsersService(usersRepository);
  const authUserUseCase = new AuthUserUseCase(usersService);

  return authUserUseCase;
}
