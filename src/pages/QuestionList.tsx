import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Title, Text, Accordion, Group, Skeleton, Box, Paper, Badge, Button } from "@mantine/core";
import { Download } from "lucide-react";
import { getQuestionsByRepository } from "../services/mockQuestionService";
import { QuestionWithState } from "../types";
import QuestionItem from "../components/QuestionItem";
import TagFilter from "../components/TagFilter";
import { userUserStore } from "../state/userStore";
import { useCurrRepoStore } from "../state/currentRepositoryStore";

const QuestionList: React.FC = () => {
  const { repoId, owner } = useParams<{ repoId: string; owner: string }>();
  const [questions, setQuestions] = useState<QuestionWithState[]>([]);
  const repo = useCurrRepoStore((i) => i.repo);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const user = userUserStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (repoId) {
          const [questionsData] = await Promise.all([getQuestionsByRepository(repoId, owner!, user!.token)]);
          setQuestions(
            questionsData.map((q) => ({
              ...q,
              isAsked: false,
              isExpanded: false,
              notes: "",
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!repo) {
      navigate("/repositories");
    } else {
      fetchData();
    }
  }, [repoId, owner, user, navigate, repo]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach((question) => {
      question.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    if (selectedTags.length === 0) return questions;
    return questions.filter((question) => question.tags.some((tag) => selectedTags.includes(tag)));
  }, [questions, selectedTags]);

  const groupedQuestions = useMemo(() => {
    const groups: Record<string, QuestionWithState[]> = {};

    if (selectedTags.length > 0) {
      selectedTags.forEach((tag) => {
        groups[tag] = filteredQuestions.filter((q) => q.tags.includes(tag));
      });
    } else {
      allTags.forEach((tag) => {
        groups[tag] = questions.filter((q) => q.tags.includes(tag));
      });
      const allGrouped = Object.entries(groups)
        .map(([, value]) => value)
        .flat();
      groups["other"] = questions.filter((x) => !allGrouped.includes(x));
    }

    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  }, [filteredQuestions, questions, allTags, selectedTags]);

  const handleToggleAsked = (questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === questionId ? { ...q, isAsked: !q.isAsked } : q)),
    );
  };

  const handleToggleExpanded = (questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === questionId ? { ...q, isExpanded: !q.isExpanded } : q)),
    );
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    setQuestions((prevQuestions) => prevQuestions.map((q) => (q.id === questionId ? { ...q, notes } : q)));
  };

  const handleExport = () => {
    const questionsWithNotes = questions.filter((q) => q.notes.trim());
    const content = questionsWithNotes.map((q) => `## ${q.title}\n\n${q.notes}\n`).join("\n---\n\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-notes-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const askedCount = questions.filter((q) => q.isAsked).length;
  const totalCount = questions.length;
  const progress = totalCount > 0 ? Math.round((askedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={50} width="50%" mb="xl" />
        <Skeleton height={30} width="70%" mb="xl" />
        <Skeleton height={200} mb="md" />
        <Skeleton height={200} mb="md" />
        <Skeleton height={200} mb="md" />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {repo && (
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
                <TagFilter allTags={allTags} selectedTags={selectedTags} onTagsChange={setSelectedTags} />
              </Group>

              <Button variant="light" leftSection={<Download size={16} />} onClick={handleExport}>
                Export Notes
              </Button>
            </Group>
          </Paper>

          {Object.entries(groupedQuestions).map(([tag, tagQuestions]) => (
            <Box key={tag} mb="xl">
              <Title order={3} mb="md">
                {tag}{" "}
                <Badge size="sm" ml={5}>
                  {tagQuestions.length}
                </Badge>
              </Title>

              <Accordion variant="contained">
                {tagQuestions.map((question) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    onToggleAsked={handleToggleAsked}
                    onToggleExpanded={handleToggleExpanded}
                    onNotesChange={handleNotesChange}
                  />
                ))}
              </Accordion>
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

export default QuestionList;
