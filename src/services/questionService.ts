import { userUserStore } from "../state/userStore";
import { Question } from "../types";
import { Octokit, RequestError } from "octokit";
import { authService } from "./authService";

export type Root = {
  viewer: {
    login: string;
  };
  repository: {
    issues: {
      nodes: Array<{
        id: string;
        title: string;
        body: string;
        repository: {
          id: string;
        };
        labels: {
          nodes: Array<{
            name: string;
          }>;
        };
        reactions: {
          totalCount: number;
          nodes: Array<{
            content: string;
            user: {
              login: string;
            };
          }>;
        };
      }>;
    };
  };
};

export const getQuestionsByRepository = async (
  repository: string,
  owner: string,
  token: string,
): Promise<Question[]> => {
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const query = `
      query {
      viewer {
         login
       }
        repository(owner: "${owner}", name: "${repository}") {
          issues(first: 100, states: OPEN) {
            nodes {
              id
              title
              body
              repository {
                id
              }
              labels(first: 10) {
                nodes {
                  name
                }
              }
              reactions(first: 20) {
                totalCount
                nodes {
                  content
                  user {
                    login
                  }
                }
              }
            }
          }
        }
      }
    `;

    const questions = await octokit.graphql<Root>(query);
    return questions.repository.issues.nodes.map(
      (q) =>
        ({
          body: q.body!,
          isStarred: q.reactions.nodes.some(
            (x) =>
              x.user.login == questions.viewer.login &&
              x.content === "THUMBS_UP",
          ),
          id: q.id.toString(),
          title: q.title,
          repositoryId: repository,
          tags: q.labels.nodes.map((label) => {
            if (typeof label === "string") {
              return label;
            } else if (typeof label === "object") {
              return label.name ?? "";
            }
            return "";
          }),
        }) satisfies Question,
    );
  } catch (error) {
    if (
      error instanceof RequestError &&
      (error.status === 404 || error.status === 403 || error.status === 401)
    ) {
      console.error(error);
      userUserStore.setState({ user: null });
      authService.signOut();
      return [];
    }
    throw error;
  }
};
