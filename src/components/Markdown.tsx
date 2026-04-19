import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  p: ({ children }) => (
    <p className="mt-6 leading-relaxed text-navy/85">{children}</p>
  ),
  h2: ({ children }) => (
    <h2 className="font-display mt-12 text-2xl font-semibold text-navy">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display mt-8 text-xl font-semibold text-navy">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-3 pl-6 text-navy/85">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-3 pl-6 text-navy/85">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-navy">{children}</strong>,
  em: ({ children }) => <em className="italic text-navy/90">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-orange underline-offset-4 hover:underline"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-gold pl-4 text-navy/80">
      {children}
    </blockquote>
  ),
};

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
