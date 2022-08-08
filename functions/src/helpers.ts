import * as fs from "fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
  TokenOptions,
} from "@firebase/rules-unit-testing";

interface CustomMatcherResult {
  pass: boolean;
  message: Record<string, unknown>;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toAllow(config?): Promise<CustomMatcherResult>;
      toDeny(config?): Promise<CustomMatcherResult>;
    }
  }
}

const setupTestEnv = async (projectId: string) => {
  if (!projectId) {
    console.log("PROJECT ID IS MISSING!!!!!!");
  }

  const testEnvInner = await initializeTestEnvironment({
    projectId,
    storage: { rules: fs.readFileSync("../storage.rules", "utf8") },
  });
  // await testEnv.clearStorage();

  return testEnvInner;
};

export const getCleanProjectId = (testName?: string): string => {
  const isolatedProjectId = testName
    .replace(/[^A-Za-z0-9]/g, "") // only leave letters and numbers
    .toLowerCase();

  return isolatedProjectId;
};

export const setupEmulator = async (
  auth: {
    uid: string;
    email?: string;
    email_verified?: boolean;
  } | null,
  projectId: string
): Promise<any> => {
  if (!projectId) {
    console.log("PROJECT ID IS MISSING!!!!!!");
  }
  const testEnvX = await setupTestEnv(projectId.toLowerCase());

  const { uid, ...token } = auth ?? {};
  const context = auth
    ? testEnvX.authenticatedContext(uid, token as TokenOptions)
    : testEnvX.unauthenticatedContext();

  return {
    firestore: context.firestore(),
    database: context.database(),
    storage: context.storage(projectId.toLowerCase()),
    projectId,
  };
};

expect.extend({
  async toAllow(x, config) {
    let pass = false;

    try {
      await assertSucceeds(x);
      pass = true;
    } catch (exception) {
      // ignore specific errors - don't stop on these
      if (config?.ignoredErrors?.includes?.(exception.code)) {
        pass = true;
      }

      if (!pass) {
        console.log(
          "\x1b[93m%s\x1b[0m",
          "RULE DID NOT PASS:",
          expect.getState().currentTestName,
          exception.code,
          x,
          config
        );
      }
    }

    return {
      pass,
      message: () =>
        "expected Firebase operation to be allowed, but it failed.",
    };
  },
});

expect.extend({
  async toDeny(x, config) {
    let pass = false;

    try {
      await assertFails(x);
      pass = true;
    } catch (exception) {
      // ignore specific errors - don't stop on these
      if (config?.ignoredErrors?.includes?.(exception.code)) {
        pass = true;
      }
    }

    return {
      pass,
      message: () =>
        "expected Firebase operation to be denied, but it was allowed.",
    };
  },
});
