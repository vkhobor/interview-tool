import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Text, Grid, Card, Group, Badge, Skeleton, Transition, Box, Button } from "@mantine/core";
import { Folder, Clock } from "lucide-react";
import { getRepositories } from "../services/mockRepositoryService";
import { Repository } from "../types";
import { userUserStore } from "../state/userStore";
import { useCurrRepoStore } from "../state/currentRepositoryStore";

const RepositoryPicker: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const setCurrRepo = useCurrRepoStore((i) => i.setRepo);
  const [loadingFirtPage, setLoadingFirstPage] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const setLoading = (loading: boolean) => {
    if (loading) {
      if (page === 1) {
        setLoadingFirstPage(true);
      } else {
        setLoadingNextPage(true);
      }
    } else {
      if (page === 1) {
        setLoadingFirstPage(false);
      } else {
        setLoadingNextPage(false);
      }
    }
  };
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const user = userUserStore((state) => state.user);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const data = await getRepositories(user!.token, page);
        setRepositories((prev) => [...prev, ...data]);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [user, page]);

  const handleRepositoryClick = (repo: string, owner: string) => {
    setCurrRepo(repositories.find((x) => x.owner == owner && x.name == repo)!);
    navigate(`/questions/${owner}/${repo}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="lg">
        Select a Repository
      </Title>
      <Text color="dimmed" mb="xl">
        Choose a question repository to begin your interview preparation
      </Text>

      <Grid>
        {loadingFirtPage
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={`skeleton-${index}`}>
                  <Skeleton height={200} radius="md" animate={true} />
                </Grid.Col>
              ))
          : repositories.map((repo) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={repo.id}>
                <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
                  {(styles) => (
                    <Card
                      style={{
                        ...styles,
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 12px 20px -10px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      withBorder
                      onClick={() => handleRepositoryClick(repo.name, repo.owner)}
                      className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <Box mb="md">
                        <Group justify="space-between" mb="xs">
                          <Group>
                            <Folder size={20} />
                            <Text fw={700} size="lg">
                              {repo.name}
                            </Text>
                          </Group>
                          <Badge color="blue" variant="light">
                            {repo.questionCount} questions
                          </Badge>
                        </Group>
                        <Text size="sm" lineClamp={3} mb="md">
                          {repo.description}
                        </Text>
                      </Box>

                      <Box mt="auto">
                        <Group justify="flex-start" gap="sm">
                          <Clock size={14} />
                          <Text size="xs" c="dimmed">
                            Updated {formatDate(repo.lastUpdated)}
                          </Text>
                        </Group>
                      </Box>
                    </Card>
                  )}
                </Transition>
              </Grid.Col>
            ))}
        {hasMore && !loadingFirtPage && (
          <Grid.Col span={12}>
            <Button onClick={() => setPage((page) => page + 1)} loading={loadingNextPage} disabled={loadingFirtPage}>
              Load More
            </Button>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default RepositoryPicker;
