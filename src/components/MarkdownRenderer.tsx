import React from "react";
import ReactMarkdown from "react-markdown";
import { Text, Title, List, Code, Paper } from "@mantine/core";
import remarkGfm from "remark-gfm";
import "@antonz/codapi/dist/snippet.js";
import InteractiveCodeblock from "./InteractiveCodeblock";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Paper p="md" withBorder className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <Title order={1} my="md" {...props} />,
          h2: ({ ...props }) => <Title order={2} my="md" {...props} />,
          h3: ({ ...props }) => <Title order={3} my="md" {...props} />,
          h4: ({ ...props }) => <Title order={4} my="md" {...props} />,
          h5: ({ ...props }) => <Title order={5} my="sm" {...props} />,
          h6: ({ ...props }) => <Title order={6} my="sm" {...props} />,
          p: ({ ...props }) => <Text my="sm" {...props} />,
          ul: ({ children, ...props }) => (
            <List my="sm" {...props}>
              {children}
            </List>
          ),
          ol: ({ children, ...props }) => (
            <List type="ordered" my="sm" {...props}>
              {children}
            </List>
          ),
          li: ({ ...props }) => <List.Item {...props} />,
          code: (f) => {
            if ((f.children as string).includes("\n") == false)
              return <Code className={f.className}>{f.children}</Code>;

            return InteractiveCodeblock({ children: f.children, className: f.className });
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Paper>
  );
};

export default MarkdownRenderer;
