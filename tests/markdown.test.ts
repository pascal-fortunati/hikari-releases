import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown } from '../src/components/markdown';
test('release Markdown cannot execute HTML, inject javascript URLs or load external tracking images', () => {
  const html = renderToStaticMarkup(
    createElement(Markdown, {
      children:
        '<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![tracker](https://evil.test/pixel.png)\n\n## Changes\n\n- **Fixed** player\n\n[Official](https://github.com/pascal-fortunati/hikari-releases)',
    })
  );
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('evil.test'));
  assert.ok(html.includes('<strong>Fixed</strong>'));
  assert.ok(html.includes('<h3>Changes</h3>'));
  assert.ok(html.includes('href="https://github.com/'));
});
