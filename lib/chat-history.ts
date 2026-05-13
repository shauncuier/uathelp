import { adminDb } from '@/lib/firebase/admin';
import type { UIMessage } from 'ai';

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim();
}

/**
 * Save a conversation turn (user question + assistant response) to Firestore.
 * Creates/updates the conversation document and adds message sub-documents.
 */
export async function saveConversationTurn(options: {
  conversationId: string;
  userId: string;
  question: string;
  response: string;
  model: string | null;
}) {
  try {
    const now = new Date().toISOString();
    const title = options.question.slice(0, 64) || 'New conversation';

    const conversationRef = adminDb.collection('conversations').doc(options.conversationId);
    const conversationDoc = await conversationRef.get();

    if (conversationDoc.exists) {
      // Update existing conversation
      const existingData = conversationDoc.data();
      await conversationRef.update({
        title: existingData?.title === 'New conversation' ? title : existingData?.title,
        model: options.model || existingData?.model || null,
        updatedAt: now,
      });
    } else {
      // Create new conversation
      await conversationRef.set({
        userId: options.userId,
        title,
        model: options.model,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Add user message
    await conversationRef.collection('messages').add({
      role: 'user',
      content: options.question,
      parts: JSON.stringify([{ type: 'text', text: options.question }]),
      createdAt: now,
    });

    // Add assistant message
    await conversationRef.collection('messages').add({
      role: 'assistant',
      content: options.response,
      parts: JSON.stringify([{ type: 'text', text: options.response }]),
      createdAt: now,
    });
  } catch (error) {
    console.error('Failed to save conversation turn:', error);
  }
}

export function getMessagePlainText(message: UIMessage) {
  return messageText(message);
}
