import { Question } from "../types";
import { Octokit } from "octokit";

export const getQuestionsByRepository = async (
	repository: string,
	owner: string,
	token: string,
): Promise<Question[]> => {
	const octokit = new Octokit({
		auth: token,
	});
	const questions = await octokit.rest.issues.listForRepo({
		owner,
		repo: repository,
	});
	return questions.data.map(
		(q) =>
			({
				body: q.body!,
				id: q.id.toString(),
				title: q.title,
				repositoryId: repository,
				tags: q.labels.map((label) => {
					if (typeof label === "string") {
						return label;
					} else if (typeof label === "object") {
						return label.name ?? "";
					}
					return "";
				}),
			}) satisfies Question,
	);
};
