import { IUsersRepostitory } from "../domain/users.interface.repository";
import { AuthInterface } from "../domain/users.dto.request";
import { User } from "../domain/users.dto.response";

export class UsersService {
  constructor(private readonly userRepository: IUsersRepostitory) {}

  async verifyUser({ email, password }: AuthInterface): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // TODO: Usar bcryptjs na produção para comparar hashes
    if (user.password !== password) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
