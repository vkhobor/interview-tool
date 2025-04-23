import { useEffect } from "react";

const PopupCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      window.opener?.postMessage({ type: "github-auth", code }, window.origin);
      window.close();
    }
  }, []);

  return (
    <div>
      <p>Completing authentication... 🌀</p>
    </div>
  );
};

export default PopupCallback;
