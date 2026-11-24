import {editorialEndpoint} from '../../../lib/editorial-mcp.mjs';
import {editorialStore} from '../../../lib/editorial-store.mjs';

export const runtime='nodejs';
export async function POST(request) {
  const secret=process.env.SUPABASE_SECRET_KEY;
  const url=process.env.SUPABASE_URL;
  return editorialEndpoint({token:process.env.MSHRAQ_MCP_TOKEN,store:secret && url ? editorialStore(url,secret) : null})(request);
}
