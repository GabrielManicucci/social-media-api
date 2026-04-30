import { UsersService } from "./users.service";
import { AuthDtoRequest } from "../domain/users.dto.request";

export class AuthUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute({
    email,
    password,
    reply,
  }: AuthDtoRequest): Promise<{ token: string; refreshToken: string }> {
    const userExists = await this.usersService.verifyUser({ email, password });

    const token = await reply.jwtSign(
      {
        sub: userExists.user_id,
      },
      { expiresIn: "2h" },
    );

    const refreshToken = await reply.jwtSign(
      {
        sub: userExists.user_id,
      },
      { expiresIn: "7d" },
    );

    return { token, refreshToken };
  }
}
