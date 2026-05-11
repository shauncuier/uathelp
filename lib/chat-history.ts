import { Pool } from "pg";
import type { UIMessage } from "ai";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return pool;
}

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export async function saveConversationTurn(options: {
  conversationId: string;
  userId: string;
  question: string;
  response: string;
  model: string | null;
}) {
  const db = getPool();
  if (!db) return;

  const title = options.question.slice(0, 64) || "New conversation";

  await db.query(
    `
      INSERT INTO conversations (id, user_id, title, model, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = CASE
          WHEN conversations.title = 'New conversation' THEN EXCLUDED.title
          ELSE conversations.title
        END,
        model = COALESCE(EXCLUDED.model, conversations.model),
        updated_at = NOW()
    `,
    [options.conversationId, options.userId, title, options.model]
  );

  await db.query(
    `
      INSERT INTO conversation_messages (conversation_id, role, content, parts)
      VALUES
        ($1, 'user', $2, $3),
        ($1, 'assistant', $4, $5)
    `,
    [
      options.conversationId,
      options.question,
      JSON.stringify([{ type: "text", text: options.question }]),
      options.response,
      JSON.stringify([{ type: "text", text: options.response }]),
    ]
  );
}

export function getMessagePlainText(message: UIMessage) {
  return messageText(message);
}
