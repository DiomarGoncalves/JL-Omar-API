import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`🚚 TruckControl API rodando na porta ${env.port}`);
});
