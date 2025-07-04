import { DB_CONFIG } from "./config/config.js";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const ADMIN_USER = {
  name: "Admin Principal",
  email: "admin@biblioteca.com",
  password: "UnaClaveSuperSegura123",
  role: "admin",
};

const CRYPT_SALT_ROUNDS = 10;

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("Conectando a la base de datos...");

    const [rows] = await connection.execute(
      "SELECT id FROM user WHERE email = ?",
      [ADMIN_USER.email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      console.log("El usuario administrador ya existe");
      return;
    }

    const passwordHash = await bcrypt.hash(
      ADMIN_USER.password,
      CRYPT_SALT_ROUNDS
    );

    await connection.execute(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [ADMIN_USER.name, ADMIN_USER.email, passwordHash, ADMIN_USER.role]
    );

    console.log("Usuario administrador creado exitosamente");
  } catch (error) {
    console.error("Error durante el seeding de la base de datos:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Conexión cerrada");
    }
  }
}

seedDatabase();
