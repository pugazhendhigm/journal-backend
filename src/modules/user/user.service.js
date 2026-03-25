import { supabase } from '../../config/supabase.js';

export const getProfile = async (id) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (id, updates) => {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteAccount = async (id) => {
  // Note: auth.admin.deleteUser requires Service Role Key. 
  // For basic Tier, we delete from profiles and let user log out.
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
};