import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const h2Render = ({ node, children, className, ...props }) => (
  <h3
    className={[
      className,
      "font-bold font-heading text-lg md:text-2xl leading-normal text-gray-800",
    ].join(" ")}
    {...props}
  >
    {children}
  </h3>
);

const components = {
  a: ({ node, children, className, ...props }) => (
    <a className={[className, "text-rose-500 underline"].join(" ")} {...props}>
      {children}
    </a>
  ),
  blockquote: ({ node, children, className, ...props }) => (
    <blockquote
      className={[className, "border-l-4 px-20 text-gray-500 italic"].join(" ")}
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: ({ node, children, className, ...props }) => (
    <pre
      className={[
        className,
        "border p-12 rounded max-w-full overflow-auto text-sm",
      ].join(" ")}
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ node, children, className, ...props }) => (
    <code
      className={[
        className,
        "font-mono bg-neutral-100 text-sm px-4 py-1 rounded text-gray-700",
      ].join(" ")}
      {...props}
    >
      {children}
    </code>
  ),
  em: ({ node, children, className, ...props }) => (
    <em className={[className, ""].join(" ")} {...props}>
      {children}
    </em>
  ),
  strong: ({ node, children, className, ...props }) => (
    <strong className={[className, "text-gray-700"].join(" ")} {...props}>
      {children}
    </strong>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h2
      className={[
        className,
        "font-heading font-extrabold py-4 md:py-8 text-lg md:text-3xl md:leading-normal text-gray-800",
      ].join(" ")}
      {...props}
    >
      {children}
    </h2>
  ),
  h2: h2Render,
  h3: h2Render,
  h4: h2Render,
  h5: h2Render,
  h6: h2Render,
  hr: ({ node, children, className, ...props }) => (
    <hr className={[className, ""].join(" ")} {...props}>
      {children}
    </hr>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={[className, ""].join(" ")} {...props}>
      {children}
    </li>
  ),
  ol: ({ node, children, className, ...props }) => (
    <ol
      className={[
        className,
        "text-sm space-y-8 md:space-y-10 md:text-base md:leading-relaxed list-decimal list-outside ml-36",
      ].join(" ")}
      {...props}
    >
      {children}
    </ol>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul
      className={[
        className,
        "text-sm space-y-8 md:space-y-10 md:text-base md:leading-relaxed list-disc list-outside ml-36",
      ].join(" ")}
      {...props}
    >
      {children}
    </ul>
  ),
  p: ({ node, children, className, ...props }) => (
    <p
      className={[
        className,
        "md:text-lg leading-relaxed md:leading-loose",
      ].join(" ")}
      {...props}
    >
      {children}
    </p>
  ),
  table: ({ node, children, className, ...props }) => (
    <table
      className={[
        className,
        "border border-collapse max-w-full overflow-auto",
      ].join(" ")}
      {...props}
    >
      {children}
    </table>
  ),
  th: ({ node, children, className, ...props }) => (
    <th className={[className, "px-16 py-8 border"].join(" ")} {...props}>
      {children}
    </th>
  ),
  td: ({ node, children, className, ...props }) => (
    <td className={[className, "px-16 py-8 border"].join(" ")} {...props}>
      {children}
    </td>
  ),
};

export default function PostBody({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
