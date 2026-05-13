import { adminDb } from '@/lib/firebase/admin';
import type { UIMessage } from 'ai';

type CacheSource = 'model' | 'fallback';

type CachedAnswer = {
  answer_markdown: string;
  answer_source: CacheSource;
  model: string | null;
  hit_count: number;
};

function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[?.!]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getLatestUserText(messages: UIMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;

    return message.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join(' ')
      .trim();
  }

  return '';
}

/**
 * Look up a cached answer by normalized question text.
 * Uses Firestore `chatQuestionCache` collection.
 */
export async function getCachedAnswer(question: string): Promise<CachedAnswer | null> {
  try {
    const normalizedQuestion = normalizeQuestion(question);
    if (!normalizedQuestion) return null;

    const snapshot = await adminDb
      .collection('chatQuestionCache')
      .where('normalizedQuestion', '==', normalizedQuestion)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Increment hit count
    await doc.ref.update({
      hitCount: (data.hitCount || 0) + 1,
      lastUsedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      answer_markdown: data.answerMarkdown,
      answer_source: data.answerSource as CacheSource,
      model: data.model || null,
      hit_count: (data.hitCount || 0) + 1,
    };
  } catch (error) {
    console.error('Chat cache lookup error:', error);
    return null;
  }
}

/**
 * Save or update a cached answer in Firestore.
 */
export async function saveCachedAnswer(options: {
  question: string;
  answerMarkdown: string;
  answerSource: CacheSource;
  model?: string | null;
}) {
  try {
    const normalizedQuestion = normalizeQuestion(options.question);
    if (!normalizedQuestion) return;

    // Check if document already exists
    const snapshot = await adminDb
      .collection('chatQuestionCache')
      .where('normalizedQuestion', '==', normalizedQuestion)
      .limit(1)
      .get();

    const now = new Date().toISOString();

    if (!snapshot.empty) {
      // Update existing
      await snapshot.docs[0].ref.update({
        question: options.question.trim(),
        answerMarkdown: options.answerMarkdown,
        answerSource: options.answerSource,
        model: options.model ?? null,
        lastUsedAt: now,
        updatedAt: now,
      });
    } else {
      // Create new
      await adminDb.collection('chatQuestionCache').add({
        normalizedQuestion,
        question: options.question.trim(),
        answerMarkdown: options.answerMarkdown,
        answerSource: options.answerSource,
        model: options.model ?? null,
        hitCount: 0,
        lastUsedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error('Chat cache save error:', error);
  }
}

export function extractAssistantText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim();
}
