import React, { useState } from "react";
import { Container, Title, Text, Button, Paper, LoadingOverlay } from "@mantine/core";
import { Github } from "lucide-react";
import { mockAuthService } from "../services/mockAuthService";
import { userUserStore } from "../state/userStore";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const setUser = userUserStore((state) => state.setUser);

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      const session = await mockAuthService.signInWithGithub();
      setUser(session.user);
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Title order={2} ta="center" mt="md" mb={50}>
          Welcome to Interview Assistant
        </Title>

        <Button fullWidth leftSection={<Github size={18} />} onClick={handleGithubLogin} variant="default" size="md">
          Continue with GitHub
        </Button>

        <Text c="dimmed" size="sm" ta="center" mt={20}>
          Sign in with GitHub to manage your interview questions
        </Text>
      </Paper>
    </Container>
  );
};

export default Login;
