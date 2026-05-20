-- database/seed.sql

-- NOTE: To run this, you must replace '00000000-0000-0000-0000-000000000000' 
-- with a real User ID from your Supabase Auth > Users table.

-- 1. Insert a Test Profile (If the trigger wasn't used)
-- INSERT INTO public.profiles (id, email, full_name, avatar_url)
-- VALUES ('YOUR_USER_ID', 'testuser@example.com', 'Test Pilot', 'https://placehold.co/100');

-- 2. Insert Sample Journal Entries
INSERT INTO public.journals (user_id, content, mood, tags, metadata)
VALUES 
(
  'YOUR_USER_ID', 
  'Finally started the AI Journal project. The modular backend structure feels really clean!', 
  'productive', 
  ARRAY['coding', 'node.js'],
  '{"tags": ["coding", "node.js"], "ai_processed": false}'
),
(
  'YOUR_USER_ID', 
  'Feeling a bit overwhelmed with the Auth flow today, but Supabase OTP makes it easier.', 
  'neutral', 
  ARRAY['learning', 'auth'],
  '{"tags": ["learning", "auth"], "ai_processed": false}'
),
(
  'YOUR_USER_ID', 
  'The weather is great today! Perfect day for a walk and some reflection.', 
  'happy', 
  ARRAY['personal', 'nature'],
  '{"tags": ["personal", "nature"], "location": "Chennai", "ai_processed": true, "sentiment": 0.9}'
);

-- 3. Verify the inserts
-- SELECT * FROM public.journals WHERE user_id = 'YOUR_USER_ID';