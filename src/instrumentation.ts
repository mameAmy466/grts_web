import { Agent, setGlobalDispatcher } from "undici";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  setGlobalDispatcher(
    new Agent({
      connectTimeout: 20_000,
      headersTimeout: 20_000,
      bodyTimeout: 30_000,
      connect: {
        timeout: 20_000,
        autoSelectFamily: true,
        autoSelectFamilyAttemptTimeout: 250,
      },
    }),
  );
}
