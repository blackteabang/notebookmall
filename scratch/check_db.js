import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notebook_mall',
    port: process.env.DB_PORT || 3306,
  });

  const [rows] = await connection.query("SHOW TABLES LIKE 'partner_inquiries'");
  console.log('Tables found:', rows);
  await connection.end();
}

checkTable().catch(console.error);
