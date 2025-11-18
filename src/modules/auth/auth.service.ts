import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../../db/client";
import { env } from "../../config/env";
import type { User } from "../../types";

export class AuthService {
  async register(params: { username: string; password: string; name: string; email?: string }) {
    const { username, password, name, email } = params;
    const existing = await sql<User[]>`SELECT * FROM users WHERE username = ${username}`;
    if (existing.length > 0) {
      throw new Error("Username já está em uso");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const rows = await sql<User[]>`
      INSERT INTO users (username, password_hash, name, email)
      VALUES (${username}, ${passwordHash}, ${name}, ${email ?? null})
      RETURNING *
    `;
    const user = rows[0];
    const token = this.generateToken(user.id);
    return {
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email }
    };
  }

  async login(username: string, password: string) {
    const rows = await sql<User[]>`SELECT * FROM users WHERE username = ${username}`;
    if (rows.length === 0) throw new Error("Usuário ou senha incorretos");
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error("Usuário ou senha incorretos");
    const token = this.generateToken(user.id);
    return {
      token,
      user: { id: user.id, username: user.username, name: user.name, email: user.email }
    };
  }

  async getProfile(userId: string) {
    const rows = await sql<User[]>`SELECT * FROM users WHERE id = ${userId}`;
    const user = rows[0];
    if (!user) throw new Error("Usuário não encontrado");
    return { id: user.id, username: user.username, name: user.name, email: user.email };
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });
  }
}
