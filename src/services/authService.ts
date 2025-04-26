import { User } from "../types";
import { clientId, redirectUri, scope, baseUrl } from "../config";

const STORAGE_KEY = "mock_github_session";

export interface AuthSession {
	user: User;
	token: string;
}

function openGitHubPopup(): Promise<string> {
	const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

	const popup = window.open(url, "githubLogin", "width=600,height=700");

	return new Promise((resolve) => {
		window.addEventListener("message", function handler(event) {
			if (event.origin !== window.location.origin) return;
			if (event.data.type === "github-auth") {
				window.removeEventListener("message", handler);
				resolve(event.data.code as string);
				popup?.close();
			}
		});
	});
}

async function exchangeCodeForToken(code: string): Promise<string> {
	const response = await fetch(`${baseUrl}/oauth/exchange`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
	});

	const body = await response.json();
	return body.body.access_token;
}

export const authService = {
	signInWithGithub: async (): Promise<AuthSession> => {
		const code = await openGitHubPopup();
		const token = await exchangeCodeForToken(code);

		const session = {
			user: {
				token,
			},
			token: token,
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

		return session;
	},

	getSession: async (): Promise<AuthSession | null> => {
		return new Promise((resolve) => {
			const session = localStorage.getItem(STORAGE_KEY);
			resolve(session ? JSON.parse(session) : null);
		});
	},

	signOut: async (): Promise<void> => {
		return new Promise((resolve) => {
			localStorage.removeItem(STORAGE_KEY);
			resolve();
		});
	},
};
