import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppShell, LoadingOverlay } from "@mantine/core";
import Login from "./pages/Login";
import RepositoryPicker from "./pages/RepositoryPicker";
import QuestionList from "./pages/QuestionList";
import { mockAuthService } from "./services/mockAuthService";
import PopupCallback from "./pages/PopupCallback";
import { userUserStore } from "./state/userStore";
import CodePopup from "./pages/CodePopup";

function App() {
  const user = userUserStore((state) => state.user);
  const setUser = userUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await mockAuthService.getSession();
        setUser(session?.user || null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/repositories" />} />
        <Route path="/code-popup" element={<CodePopup />} />
        <Route path="/popup-callback" element={<PopupCallback />} />
        <Route path="/repositories" element={user ? <RepositoryPicker /> : <Navigate to="/login" />} />
        <Route path="/questions/:owner/:repoId" element={user ? <QuestionList /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/repositories" : "/login"} />} />
      </Routes>
    </AppShell>
  );
}

export default App;
