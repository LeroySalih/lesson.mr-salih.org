import pg, { Result } from "pg";
import {z} from "zod";

export const dbConnection = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST
};



const { Pool } = pg
export const pool = new Pool(dbConnection);

export type ExecResult<T> = { data: T[] | null; error: string | null };


export const testConnection = async () => {

    try{

    console.log("Connecting to DB with", dbConnection);

    const result = await pool.query("SELECT current_database(), current_schema();");
    console.log("Database connection result", result.rows);

    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log("Database tables", tables.rows);

    } catch (error) {
        console.error("Error connecting to the database", error);
    }

}



export async function execOne<S extends z.ZodTypeAny>(
  sql: string,
  params: unknown[],
  schema: S
): Promise<{ data: z.output<S> | null; error: string | null }> {
  
  console.log("Starting execOne")
  try {
    const result = await pool.query(sql, params);
    
    if (!result.rows?.[0]) {
      console.error("execOne - no rows returned")
      return { data: null, error: null }; // no row found
    } else {
      console.log("execOne:: received", result.rows?.length);
    }

    console.log("checking Safe Parse", schema);
    const parsed = schema.safeParse(result.rows[0]);

    if (!parsed.success) {
      console.error("Error: execOne parse error", parsed.error.message, result.rows)  
      return { data: null, error: parsed.error.message };
    }

    return { data: parsed.data, error: null };

  } catch (err) {
    console.error("Error - execOne", (err as Error).message)
    return { data: null, error: (err as Error).message };
  }
}



export async function execSql<S extends z.ZodTypeAny>(
  sql: string,
  params: unknown[],
  schema: S
): Promise<ExecResult<z.output<S>>> {
  let result = null;

  try {

    result = await pool.query(sql, params);     // rows: unknown[]

    const value = result.rows;
        
    const parsed = schema.array().parse(result.rows);

    return { data: result.rows, error: null };
  } catch (err) {
    console.error("Error: execSql", (err as Error).message);
    console.error(result?.rows);
    return { data: null, error: (err as Error).message };
  }
}

