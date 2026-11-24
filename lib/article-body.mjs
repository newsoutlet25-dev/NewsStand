export function normalizeArticleBody(text) {
  return text.replace(/\\r\\n|\\n|\\r|\r\n?/g, '\n');
}

export function articleBlocks(body) {
  return normalizeArticleBody(body).split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const heading = /^(#{2,3})[ \t]+(.+)$/.exec(line);
    if (!heading) return {tag: 'p', text: line};
    return {tag: heading[1] === '##' ? 'h2' : 'h3', text: heading[2]};
  });
}
