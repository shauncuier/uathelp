import { Pool } from "pg";
import type { UIMessage } from "ai";

type CacheSource = "model" | "fallback";

type CachedAnswer = {
  answer_markdown: string;
  answer_source: CacheSource;
  model: string | null;
  hit_count: number;
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return pool;
}

function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[?.!]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLatestUserText(messages: UIMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== "user") continue;

    return message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(" ")
      .trim();
  }

  return "";
}

async function ensureSchema(poolInstance: Pool) {
  if (!schemaReady) {
    schemaReady = poolInstance.query(`
      CREATE TABLE IF NOT EXISTS chat_question_cache (
        id BIGSERIAL PRIMARY KEY,
        normalized_question TEXT UNIQUE NOT NULL,
        question TEXT NOT NULL,
        answer_markdown TEXT NOT NULL,
        answer_source TEXT NOT NULL DEFAULT 'model',
        model TEXT,
        hit_count INTEGER NOT NULL DEFAULT 0,
        last_used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS chat_question_cache_last_used_at_idx
        ON chat_question_cache (last_used_at DESC);
    `).then(() => undefined);
  }

  return schemaReady;
}

export async function getCachedAnswer(question: string): Promise<CachedAnswer | null> {
  const db = getPool();
  if (!db) return null;

  await ensureSchema(db);

  const normalizedQuestion = normalizeQuestion(question);
  if (!normalizedQuestion) return null;

  const { rows } = await db.query<CachedAnswer>(
    `
      SELECT answer_markdown, answer_source, model, hit_count
      FROM chat_question_cache
      WHERE normalized_question = $1
      LIMIT 1
    `,
    [normalizedQuestion]
  );

  const cached = rows[0];
  if (!cached) return null;

  await db.query(
    `
      UPDATE chat_question_cache
      SET hit_count = hit_count + 1,
          last_used_at = NOW(),
          updated_at = NOW()
      WHERE normalized_question = $1
    `,
    [normalizedQuestion]
  );

  return cached;
}

export async function saveCachedAnswer(options: {
  question: string;
  answerMarkdown: string;
  answerSource: CacheSource;
  model?: string | null;
}) {
  const db = getPool();
  if (!db) return;

  await ensureSchema(db);

  const normalizedQuestion = normalizeQuestion(options.question);
  if (!normalizedQuestion) return;

  await db.query(
    `
      INSERT INTO chat_question_cache (
        normalized_question,
        question,
        answer_markdown,
        answer_source,
        model,
        last_used_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (normalized_question)
      DO UPDATE SET
        question = EXCLUDED.question,
        answer_markdown = EXCLUDED.answer_markdown,
        answer_source = EXCLUDED.answer_source,
        model = EXCLUDED.model,
        last_used_at = NOW(),
        updated_at = NOW()
    `,
    [
      normalizedQuestion,
      options.question.trim(),
      options.answerMarkdown,
      options.answerSource,
      options.model ?? null,
    ]
  );
}

export function extractAssistantText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}
