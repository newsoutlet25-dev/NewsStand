import {z} from 'zod';
import {normalizeArticleBody} from './article-body.mjs';

export const bodyGuide = 'Send body as plain text with real newlines. Put each paragraph on its own line. Optional subheadings go on separate lines starting with "## " for H2 or "### " for H3. The article title supplies H1. HTML and other Markdown are treated as text.';
export const bodyField = z.string().max(1000000).overwrite(normalizeArticleBody).trim().min(1).describe(bodyGuide);
