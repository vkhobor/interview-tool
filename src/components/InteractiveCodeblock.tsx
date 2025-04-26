import "@antonz/codapi/dist/snippet.js";

import { Code } from "@mantine/core";
import { useEffect } from "react";

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

  const id = btoa(children as string)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 70);

  useEffect(() => {
    const snip = document.querySelector(`#${id} codapi-snippet`);
    const handleShare = (e: Event): void => {
      const code = (e!.target! as unknown as { code: string }).code;
      window.open(
        "/code-popup?code=" + encodeURIComponent(code) + "&type=" + encodeURIComponent(className!),
        "codePopup",
        "width=600,height=700",
      );
    };
    snip!.addEventListener("popout", handleShare);
    return () => snip!.removeEventListener("popout", handleShare);
  }, [className, id]);

  const config = getSnippetConfig();

  return (
    <div className="code-block" id={id}>
      <Code block className={className}>
        {children}
      </Code>
      {config && (
        <codapi-snippet
          actions="Popout:@popout"
          engine={config.engine}
          sandbox={config.sandbox}
          editor={config.editor}
        ></codapi-snippet>
      )}
    </div>
  );
};

export default InteractiveCodeblock;
