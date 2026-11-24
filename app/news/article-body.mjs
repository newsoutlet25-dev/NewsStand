import {createElement} from 'react';
import {articleBlocks} from '../../lib/article-body.mjs';

export default function ArticleBody({body}) {
  return createElement('div', {className: 'reader-body'}, articleBlocks(body).map(({tag, text}, index) =>
    createElement(tag, {key: index}, text)
  ));
}
