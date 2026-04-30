import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { authPlugin } from "./plugins/auth.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { swaggerPlugin } from "./plugins/swagger.plugin";
import { usersRoutes } from "./users/infra/users.routes";
import { postsRoutes } from "./posts/infra/posts.routes";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(swaggerPlugin);
app.register(authPlugin);
app.register(corsPlugin);

app.register(usersRoutes);
app.register(postsRoutes);
