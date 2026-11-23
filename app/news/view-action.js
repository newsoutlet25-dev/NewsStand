'use server';

import {addArticleView} from '../../lib/news';

export async function recordView(slug) {
  return addArticleView(slug);
}
