import React from "react";
import ReactMarkdown from "react-markdown";
import { Text, Title, List, Code, Paper } from "@mantine/core";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Paper p="md" withBorder className="markdown-body">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <Title order={1} my="md" {...props} />,
          h2: ({ node, ...props }) => <Title order={2} my="md" {...props} />,
          h3: ({ node, ...props }) => <Title order={3} my="md" {...props} />,
          h4: ({ node, ...props }) => <Title order={4} my="md" {...props} />,
          h5: ({ node, ...props }) => <Title order={5} my="sm" {...props} />,
          h6: ({ node, ...props }) => <Title order={6} my="sm" {...props} />,
          p: ({ node, ...props }) => <Text my="sm" {...props} />,
          ul: ({ node, ...props }) => <List my="sm" {...props} />,
          ol: ({ node, ...props }) => <List type="ordered" my="sm" {...props} />,
          li: ({ node, ...props }) => <List.Item {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            return inline ? (
              <Code {...props}>{children}</Code>
            ) : (
              <Code block className={className} {...props}>
                {children}
              </Code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Paper>
  );
};

export default MarkdownRenderer;
