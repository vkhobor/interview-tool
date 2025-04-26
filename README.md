
# Interview tool for technical interviewers

This project aims to simplify organizing questions for technical interviews

It uses github as a backend:

- You need a repository that your github user has access to. (Owner or Collaborator)
- You need to add issues to the repo where you use title as interview question, body as help and context for the interview question

  
## Demo

https://interview-tool.pages.dev/
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m800417139-b8874073620f25733b1f50ec)

> [!WARNING]
> You need a github account.
> You need to create a repository that you have access to, and technical questions added as issues.

## Screenshots

![Repositories Screenshot](/screenshots/repos.png)

![Questions Screenshot](/screenshots/questions.png)


## Features

- View interview questions
- Markdown preview
- Runnable code snippets
- Code snippets can be opened in separate window for sharing
- Notes for interviewee's anwsers
    - Notes are downloadable (not saved otherwise)

## Tech Stack

**Client:** React, Tailwind, Vite, Zustand

**Server:** Cloudflare workers/functions


## Authors

- [@vkhobor](https://www.github.com/vkhobor)


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Add local configuration

- copy the `.env.example` and rename to `.env`
    - this is the config of the client
- copy the `.dev.vars.example` and rename to `.dev.vars`
    - this is the configuration of your local cloudflare server
- create a github oath2 application in settings/developer tools
- use the example values to set up the callbacks and allowed domains
- generate a secret
- add the clientId and secret to `.env` and `.dev.vars`



Start the server

```bash
  npm run wrangler:dev
```

Start the client

```bash
  npm run dev
```



