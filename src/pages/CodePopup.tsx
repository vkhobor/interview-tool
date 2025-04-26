import { useEffect, useState } from "react";
import InteractiveCodeblock from "../components/InteractiveCodeblock";

const CodeCallback = () => {
  const [type, setType] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");
    const codeParam = decodeURIComponent(params.get("code") || "");
    setType(typeParam);
    setCode(codeParam);
  }, []);

  return (
    <div className="code-popup">
      {type && code ? (
        <InteractiveCodeblock className={type}>{code}</InteractiveCodeblock>
      ) : (
        <p>Processing shared code... 🌀</p>
      )}
    </div>
  );
};

export default CodeCallback;
