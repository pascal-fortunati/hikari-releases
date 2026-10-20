import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url) => {
          const safe = defaultUrlTransform(url);
          if (/^(https?:\/\/|\/|#)/i.test(safe)) return safe;
          return '';
        }}
        components={{
          // External release Markdown cannot insert trackers or executable HTML.
          img: ({ alt }) => <span>{alt ? `[Image : ${alt}]` : ''}</span>,
          a: ({ href, children }) => (
            <a href={href} rel="noreferrer noopener">
              {children}
            </a>
          ),
          h1: ({ children }) => <h3>{children}</h3>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
