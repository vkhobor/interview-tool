export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
	const headers = request.headers;
	const body = await request.json();
	const origin = headers.get("origin") || headers.get("Origin");

	const config = {
		clientId: env.GITHUB_CLIENT_ID,
		clientSecret: env.GITHUB_CLIENT_SECRET,
		redirectUri: env.GITHUB_REDIRECT_URI,
		allowedOrigins: env.ALLOWED_ORIGINS.split(","),
	};

	// Check for malicious request
	if (!config.allowedOrigins.includes(origin || "")) {
		return new Response(`${origin} is not an allowed origin.`, {
			status: 403,
		});
	}

	const url = "https://github.com/login/oauth/access_token";
	const typedBody = body as { code: string };
	const params = new URLSearchParams({
		code: typedBody.code,
		client_id: config.clientId,
		client_secret: config.clientSecret,
		redirect_uri: config.redirectUri,
	});

	// Request to GitHub with the given code
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: params.toString(),
		});

		if (!response.ok) {
			const error = await response.text();
			return new Response(`GitHub API error: ${error}`, {
				status: response.status,
			});
		}

		const jsonResponse = await response.json();

		return new Response(
			JSON.stringify({
				success: true,
				body: jsonResponse,
			}),
			{
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (err) {
		return new Response(`Error: ${err.message}`, { status: 500 });
	}
};
