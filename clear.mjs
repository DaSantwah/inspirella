import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log("Clearing posts...");
  const { error: err1 } = await supabase.from('posts').delete().neq('id', 0);
  if (err1) console.error("Error clearing posts:", err1);
  else console.log("Posts cleared.");

  console.log("Clearing artworks...");
  const { error: err2 } = await supabase.from('artworks').delete().neq('id', 0);
  if (err2) console.error("Error clearing artworks:", err2);
  else console.log("Artworks cleared.");
}

clearData();
