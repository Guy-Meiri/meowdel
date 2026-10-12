# Meowdel

A tiny Weave that only generates cats. Type a prompt, click **Generate**, and the model's result, always a
cat, joins your workflow.

It exists to show how Weave's browser integration tests are built, one idea per commit.

## Run it

```sh
pnpm install
pnpm dev
```

Then open http://localhost:5173. In development, Vite also serves a small in-memory API at `/api`
([`server/dev-api.ts`](server/dev-api.ts)), and its "model" answers every prompt with a random cat from
[cataas.com](https://cataas.com).

## The steps

Each commit adds one idea, and each is tagged. Check out a tag to see the code at that step, or read them all in
order with `git log --reverse -p`.

- `step-1-app`: The app, with nothing testing it yet
