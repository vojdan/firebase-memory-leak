import { getCleanProjectId, setupEmulator } from "./helpers";

const MY_USER_ID = "alice";
const MY_AUTH = {
  uid: MY_USER_ID,
  email: "my@email.com",
  email_verified: true,
};

const FIRESTORE_PROJECT_ID = getCleanProjectId("name-4x1");
describe("Storage access 4x1", () => {
  it("can read my own", async () => {
    expect.assertions(1);

    const { storage } = await setupEmulator(MY_AUTH, FIRESTORE_PROJECT_ID);
    const myFolderRef = storage.ref("alice/folder");

    await expect(myFolderRef.list()).toAllow();
  });
});
