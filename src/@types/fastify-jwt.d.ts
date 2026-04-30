import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
      role?: string;
    };
  }
}

declare module "fastify" {
  export interface FastifyRequest {
    user: {
      sub: string;
    };
  }
  export interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}
