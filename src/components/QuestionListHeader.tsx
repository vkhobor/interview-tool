import { Title, Paper, Button, Group, Box, Text, Badge } from "@mantine/core";
import React from "react";
import TagFilter from "./TagFilter";
import { Download } from "lucide-react";

const Header = React.memo(
  ({
    repo,
    progress,
    askedCount,
    totalCount,
    allTags,
    selectedTags,
    onTagsChange,
    onExport,
  }: {
    repo: { name: string; description: string };
    progress: number;
    askedCount: number;
    totalCount: number;
    allTags: string[];
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    onExport: () => void;
  }) => (
    <>
      <Title order={1} mb="md">
        {repo.name}
      </Title>
      <Text color="dimmed" mb="xl">
        {repo.description}
      </Text>

      <Paper p="md" withBorder mb="xl">
        <Group justify="space-between">
          <Group gap="lg">
            <Box>
              <Text size="sm" fw={500} mb={5}>
                Interview Progress
              </Text>
              <Group>
                <Badge color={progress === 100 ? "green" : "blue"}>
                  {askedCount} of {totalCount} questions asked ({progress}%)
                </Badge>
              </Group>
            </Box>
            <TagFilter allTags={allTags} selectedTags={selectedTags} onTagsChange={onTagsChange} />
          </Group>

          <Button variant="light" leftSection={<Download size={16} />} onClick={onExport}>
            Export Notes
          </Button>
        </Group>
      </Paper>
    </>
  ),
);

export default Header;
