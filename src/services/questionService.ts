import { userUserStore } from "../state/userStore";
import { Question } from "../types";
import { Octokit, RequestError } from "octokit";
import { authService } from "./authService";

export const getQuestionsByRepository = async (
	repository: string,
	owner: string,
	token: string,
): Promise<Question[]> => {
	const octokit = new Octokit({
		auth: token,
	});
	try {
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
