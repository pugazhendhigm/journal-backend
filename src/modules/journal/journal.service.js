import { supabase } from '../../config/supabase.js';

const normalizeTags = (tags) =>
  Array.isArray(tags)
    ? tags
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter(Boolean)
    : [];

const toJournalResponse = (journal) => {
  if (!journal) {
    return journal;
  }

  return {
    ...journal,
    tags: normalizeTags(journal.tags?.length ? journal.tags : journal.metadata?.tags),
    metadata: {
      ...(journal.metadata || {}),
      tags: normalizeTags(journal.tags?.length ? journal.tags : journal.metadata?.tags),
    },
  };
};

export const createJournal = async (userId, journalData) => {
  const tags = normalizeTags(journalData.tags);
  const { data, error } = await supabase.from('journals').insert([{
    user_id: userId,
    content: journalData.content,
    mood: journalData.mood,
    tags,
    metadata: { ...(journalData.metadata || {}), tags }
  }]).select();
  if (error) throw error;
  return toJournalResponse(data[0]);
};

export const getJournals = async (userId) => {
  const { data, error } = await supabase.from('journals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(toJournalResponse);
};

export const getJournalById = async (userId, id) => {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .match({ id, user_id: userId })
    .single();
  if (error) throw error;
  return toJournalResponse(data);
};

export const updateJournal = async (userId, id, updates) => {
  const tags = normalizeTags(updates.tags ?? updates.metadata?.tags);
  const payload = {
    content: updates.content,
    mood: updates.mood,
    tags,
    metadata: {
      ...(updates.metadata || {}),
      tags,
    },
  };
  const { data, error } = await supabase.from('journals').update(payload).match({ id, user_id: userId }).select();
  if (error) throw error;
  return toJournalResponse(data[0]);
};

export const deleteJournal = async (userId, id) => {
  const { error } = await supabase.from('journals').delete().match({ id, user_id: userId });
  if (error) throw error;
};