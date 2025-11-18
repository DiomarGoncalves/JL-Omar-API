import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`🚚 JL Omar (controle de produção) API rodando na porta ${env.port}`);
});
