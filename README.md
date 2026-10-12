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

## Test it

```sh
pnpm exec playwright install chromium # once, with the ffmpeg Playwright records videos with
pnpm test
pnpm test --ui                        # watch each step, with the network and a snapshot of the page
pnpm test --debug                     # step through a test one action at a time
SLOWMO=700 pnpm test --headed         # watch a run in slow motion
```

The tests run against a production build that points at `https://api.meowdel.test`, a host that doesn't exist
(see [`.env.test`](.env.test)). There is no backend in tests: each test answers the API itself.

A failed test keeps a trace, a video and a screenshot in `test-results/`. To stop a test at one line, add
`await page.pause();` there and run it with `--headed`.

## The steps

Each commit adds one idea, and each is tagged. Check out a tag to see the code at that step, or read them all in
order with `git log --reverse -p`.

- `step-1-app`: The app, with nothing testing it yet
- `step-2-page`: A test that uses only `page`, answering the API with `page.route`
- `step-3a-fixture`: A `network` fixture, so a test answers the API with `network.mock`
- `step-3b-offline`: Nothing leaves the machine: the app loads, images get a test cat, and everything else is blocked
