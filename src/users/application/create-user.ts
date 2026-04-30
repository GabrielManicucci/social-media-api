import { IUsersRepostitory } from "../domain/users.interface.repository";
import { CreateUserDtoRequest } from "../domain/users.dto.request";
import { User } from "../domain/users.dto.response";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUsersRepostitory) {}

  async execute(user: CreateUserDtoRequest): Promise<User> {
    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists) {
      throw new Error("User already exists");
    }

    return await this.userRepository.create(user);
  }
}
