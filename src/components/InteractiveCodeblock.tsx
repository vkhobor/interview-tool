import "@antonz/codapi/dist/snippet.js";

import { Code } from "@mantine/core";

interface InteractiveCodeblockProps {
  className: string | undefined;
  children: React.ReactNode;
}

const InteractiveCodeblock: React.FC<InteractiveCodeblockProps> = ({ className, children }) => {
  const getSnippetConfig = () => {
    switch (className) {
      case "language-javascript":
        return { engine: "browser", sandbox: "javascript", editor: "basic" };
      case "language-typescript":
        return { engine: "codapi", sandbox: "typescript", editor: "basic" };
      case "language-python":
        return { engine: "codapi", sandbox: "python", editor: "basic" };
      case "language-csharp":
        return { engine: "codapi", sandbox: "mono", editor: "basic" };
      case "language-java":
        return { engine: "codapi", sandbox: "java", editor: "basic" };
      case "language-sql":
        return { engine: "codapi", sandbox: "sqlite", editor: "basic" };
      default:
        return undefined;
    }
  };

  const config = getSnippetConfig();

  return (
    <div>
      <Code block className={className}>
        {children}
      </Code>
      {config && (
        <codapi-snippet engine={config.engine} sandbox={config.sandbox} editor={config.editor}></codapi-snippet>
      )}
    </div>
  );
};

export default InteractiveCodeblock;
