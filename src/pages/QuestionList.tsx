import {
  Accordion,
  Badge,
  Box,
  Container,
  Skeleton,
  Title,
} from "@mantine/core";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionItem from "../components/QuestionItem";
import Header from "../components/QuestionListHeader";
import { getQuestionsByRepository } from "../services/questionService";
import { useCurrRepoStore } from "../state/currentRepositoryStore";
import { useQuestionsStore } from "../state/questionStore";
import { userUserStore } from "../state/userStore";

const QuestionList: React.FC = () => {
  const { repoId, owner } = useParams<{ repoId: string; owner: string }>();
  useSignals();
  const repo = useCurrRepoStore((i) => i.repo);
  const navigate = useNavigate();
  const user = userUserStore((state) => state.user);

  const [loading, setLoading] = useState(true);

  const {
    questions,
    selectedTags,
    filteredGroupedQuestions,
    toggleAsked,
    toggleExpanded,
    updateNotes,
    askedCount,
    progress,
    allTags,
    totalCount,
    isStarredFilterOn,
  } = useQuestionsStore({
    questions: [],
    selectedTags: [],
    isStarredFilterOn: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (repoId) {
          const [questionsData] = await Promise.all([
            getQuestionsByRepository(repoId, owner!, user!.token),
          ]);
          questions.value = questionsData.map((q) => ({
            ...q,
            isAsked: false,
            isExpanded: false,
            isHidden: false,
            notes: "",
          }));
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
  }, [repoId, owner, user, navigate, repo, questions]);

  const handleToggleAsked = toggleAsked;

  const handleToggleExpanded = toggleExpanded;

  const handleNotesChange = (id: string, notes: string) => {
    updateNotes(id, notes);
  };

  const handleExport = () => {
    const questionsWithNotes = questions.value.filter((q) => q.notes.trim());
    const content = questionsWithNotes
      .map((q) => `## ${q.title}\n\n${q.notes}\n`)
      .join("\n---\n\n");

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
          <Header
            repo={repo}
            progress={progress.value}
            onStarredFilterChange={(on) => {
              isStarredFilterOn.value = on;
            }}
            isStarredFilter={isStarredFilterOn.value}
            askedCount={askedCount.value}
            totalCount={totalCount.value}
            allTags={allTags.value}
            selectedTags={selectedTags.value}
            onTagsChange={(tags) => {
              questions.value = questions.value.map((x) => {
                return { ...x, isExpanded: false };
              });
              selectedTags.value = tags;
            }}
            onExport={handleExport}
          />

          {Object.entries(filteredGroupedQuestions.value[0]).map(
            ([tag, tagQuestions]) => (
              <Box
                key={tag}
                mb="xl"
                className={`${tagQuestions.every((q) => q.isHidden) ? "hidden" : ""}`}
              >
                <Title order={3} mb="md">
                  {filteredGroupedQuestions.value[1] ?? tag}{" "}
                  <Badge size="sm" ml={5}>
                    {tagQuestions.filter((q) => !q.isHidden).length}
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
            ),
          )}
        </>
      )}
    </Container>
  );
};

export default QuestionList;
