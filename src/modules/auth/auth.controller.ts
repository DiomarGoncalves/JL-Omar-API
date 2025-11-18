import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middleware/authMiddleware";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password, name, email } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ message: "username, password e name são obrigatórios" });
      }
      const result = await authService.register({ username, password, name, email });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Erro ao registrar usuário" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "username e password são obrigatórios" });
      }
      const result = await authService.login(username, password);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) return res.status(401).json({ message: "Não autenticado" });
      const user = await authService.getProfile(req.userId);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Erro ao buscar perfil" });
    }
  }
}
