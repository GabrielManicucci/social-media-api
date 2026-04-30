import { app } from "./app";
import { env } from "./env/env";
import "./queue/like.worker";

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`);
    console.log(`BullMQ Like Worker started successfully.`);
  });
