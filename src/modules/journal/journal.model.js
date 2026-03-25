// Defines the structure for a Journal Entry
export const JournalEntrySchema = {
  id: 'uuid',
  user_id: 'uuid',
  content: 'text',
  mood: 'string', // e.g., 'happy', 'neutral', 'sad'
  metadata: {
    tags: 'array',
    ai_summary: 'string',
    sentiment_score: 'number'
  },
  created_at: 'timestamp'
};