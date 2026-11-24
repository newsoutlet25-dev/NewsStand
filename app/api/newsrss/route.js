import {createClient} from '@supabase/supabase-js';
import {receiveNews, storageCredential} from '../../../lib/newsrss-receiver.mjs';
import {toDraft} from '../../../lib/newsrss-draft.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  const token = process.env.NEWSRSS_TOKEN;
  return receiveNews(request, token, async items => {
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
      auth:{persistSession:false,autoRefreshToken:false}
    });
    const {error} = await db.rpc('receive_newsrss_drafts',{
      credential:storageCredential(token), drafts:items.map(toDraft)
    });
    if (error) throw Error('Draft write failed');
  });
}
