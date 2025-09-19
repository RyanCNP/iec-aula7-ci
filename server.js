import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

// --- Carregar variáveis de ambiente ---
dotenv.config();

// --- Configurações via env ---
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

// --- OpenAPI 3.0 inline ---
const openapi = {
  openapi: "3.0.3",
  info: { title: "Items API", version: "0.1.0" },
  servers: [{ url: `http://localhost:${PORT}` }],
  paths: { /* ... mantém igual ... */ },
  components: { /* ... mantém igual ... */ }
};

// --- App ---
const app = express();

// Configurar CORS dinamicamente
app.use(cors({
  origin: ALLOWED_ORIGIN,
}));

app.use(express.json());

// Banco em memória
const db = new Map();
let seq = 1;

// Swagger UI
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openapi));

// Endpoints
app.get("/items", (req, res) => {
  res.json(Array.from(db.values()));
});

app.post("/items", (req, res) => {
  const { name, quantity } = req.body || {};
  if (typeof name !== "string" || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: "Payload inválido" });
  }
  const id = String(seq++);
  const item = { id, name, quantity };
  db.set(id, item);
  res.status(201).json(item);
});

app.get("/items/:id", (req, res) => {
  const item = db.get(req.params.id);
  if (!item) return res.status(404).json({ error: "Não encontrado" });
  res.json(item);
});

app.put("/items/:id", (req, res) => {
  const item = db.get(req.params.id);
  if (!item) return res.status(404).json({ error: "Não encontrado" });

  const { name, quantity } = req.body || {};
  if (name === undefined && quantity === undefined) {
    return res.status(400).json({ error: "Nenhum campo válido informado" });
  }

  const updated = {
    ...item,
    ...(typeof name === "string" ? { name } : {}),
    ...(Number.isInteger(quantity) && quantity >= 0 ? { quantity } : {})
  };

  db.set(req.params.id, updated);
  res.json(updated);
});

app.delete("/items/:id", (req, res) => {
  if (!db.has(req.params.id)) return res.status(404).json({ error: "Não encontrado" });
  db.delete(req.params.id);
  res.status(204).send();
});

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Servidor
if (process.env.JEST_WORKER_ID === undefined) {
  app.listen(PORT, () => {
    console.log(`✅ API rodando em http://localhost:${PORT}`);
    console.log(`📖 Swagger em http://localhost:${PORT}/swagger`);
    console.log(`🌍 CORS habilitado para: ${ALLOWED_ORIGIN}`);
  });
}

export default app;