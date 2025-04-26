import { userUserStore } from "../state/userStore";
import { Repository } from "../types";
import { Octokit, RequestError } from "octokit";
import { authService } from "./authService";

export const getRepositories = async (
	token: string,
	page: number,
): Promise<Repository[]> => {
	const octokit = new Octokit({
		auth: token,
	});
	try {
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
