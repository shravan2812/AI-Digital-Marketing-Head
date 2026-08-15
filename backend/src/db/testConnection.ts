import pool from "./connection.js";

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("✅ PostgreSQL connected");
    console.log(result.rows[0]);

    await pool.end();
  } catch (error) {
    console.error("❌ PostgreSQL connection failed");
    console.error(error);
  }
};

testConnection();