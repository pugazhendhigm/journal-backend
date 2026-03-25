import { supabase } from '../../config/supabase.js';

export const createJournal = async (userId, journalData) => {
  const { data, error } = await supabase.from('journals').insert([{
    user_id: userId,
    content: journalData.content,
    mood: journalData.mood,
    metadata: { tags: journalData.tags || [] }
  }]).select();
  if (error) throw error;
  return data[0];
};

export const getJournals = async (userId) => {
  const { data, error } = await supabase.from('journals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateJournal = async (userId, id, updates) => {
  const { data, error } = await supabase.from('journals').update(updates).match({ id, user_id: userId }).select();
  if (error) throw error;
  return data[0];
};

export const deleteJournal = async (userId, id) => {
  const { error } = await supabase.from('journals').delete().match({ id, user_id: userId });
  if (error) throw error;
};