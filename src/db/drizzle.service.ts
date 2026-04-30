import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import "dotenv/config";
import { env } from "../env/env";

type DatabaseDrizzle = ReturnType<typeof drizzle<typeof schema>>;

export class DrizzleService {
  private readonly pool: Pool;
  private readonly drizzleDatabase: DatabaseDrizzle;

  constructor() {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const poolClient = (this.pool = new Pool({
      connectionString: env.DATABASE_URL,
    }));

    this.drizzleDatabase = drizzle(poolClient, { schema });
  }

  get client() {
    return this.drizzleDatabase;
  }
}

export const drizzleService = new DrizzleService();
