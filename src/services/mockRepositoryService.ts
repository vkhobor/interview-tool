import { Repository } from "../types";
import { Octokit } from "octokit";

export const getRepositories = async (
	token: string,
	page: number,
): Promise<Repository[]> => {
	const octokit = new Octokit({
		auth: token,
	});
	const { data } = await octokit.rest.repos.listForAuthenticatedUser({
		page,
		per_page: 10,
		sort: "updated",
		direction: "desc",
	});
	return data.map(
		(repo) =>
			({
				id: repo.id.toString(),
				name: repo.name,
				questionCount: repo.open_issues_count,
				description: repo.description!,
				lastUpdated: repo.updated_at!,
				owner: repo.owner.login,
			}) satisfies Repository,
	);
};
