import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Group, Text, Button, Container, Box, Avatar, Menu } from '@mantine/core';
import { ArrowLeft, BookOpen, LogOut, User } from 'lucide-react';
import { mockAuthService } from '../services/mockAuthService';
import type { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isQuestionsPage = location.pathname.includes('/questions');
  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    await mockAuthService.signOut();
    navigate('/login');
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <Box component="header" py="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container size="xl">
        <Group justify="space-between">
          <Group>
            {isQuestionsPage && (
              <Button
                variant="subtle"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => navigate('/repositories')}
              >
                Back to Repositories
              </Button>
            )}
            {!isQuestionsPage && (
              <Group>
                <BookOpen size={24} />
                <Text size="xl" fw={700}>Interview Assistant</Text>
              </Group>
            )}
          </Group>
          
          {isQuestionsPage && (
            <Text size="xl" fw={700}>Interview Questions</Text>
          )}
          
          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" p={0}>
                  <Group gap="sm">
                    <Avatar src={user.avatarUrl} radius="xl" />
                    <Text size="sm" fw={500}>{user.name}</Text>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<LogOut size={14} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </Box>
  );
};

export default Header;