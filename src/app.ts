import fastify from "fastify";
import { authPlugin } from "./plugins/auth.plugin";
import { corsPlugin } from "./plugins/cors.plugin";
import { usersRoutes } from "./users/infra/users.routes";
import { postsRoutes } from "./posts/infra/posts.routes";

export const app = fastify();

app.register(authPlugin);
app.register(corsPlugin);

app.register(usersRoutes);
app.register(postsRoutes);
