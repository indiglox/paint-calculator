import { validSingleRoomScenario } from "./data/calculation-scenarios";
import { expect, test } from "./fixtures";
import { goToDimensions, submitCalculation } from "./support/paint-calculator.flow";

test.describe("Validation and navigation coverage", () => {
  test("requires a room count before leaving the home page [PW-004] @validation", async ({ homePage }) => {
    await test.step("Try to submit the home form without a room count", async () => {
      await homePage.goto();
      await homePage.submit();
      await homePage.expectRoomCountRequired();
    });
  });

  test("requires room dimensions before posting the calculation [PW-005] @validation", async ({
    homePage,
    dimensionsPage,
  }) => {
    await test.step("Try to submit the dimensions form with blank inputs", async () => {
      await goToDimensions(homePage, dimensionsPage, 2);
      await dimensionsPage.submit();
      await expect(dimensionsPage.page).toHaveURL(/\/dimensions\?rooms=2$/);
      await dimensionsPage.expectFieldValueMissing("length", 0);
    });
  });

  test("returns the user to the start page from results [PW-012] @bug", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    test.fail(true, "Known defect: the results page Home action does not currently navigate back to '/'.");

    await test.step("Complete a calculation and use the Home action", async () => {
      await submitCalculation(homePage, dimensionsPage, resultsPage, validSingleRoomScenario.rooms);
      await resultsPage.goHome();
      await expect(resultsPage.page).toHaveURL(/\/$/);
      await homePage.expectLoaded();
    });
  });

  test("rejects direct navigation with zero rooms [PW-013] @bug", async ({
    homePage,
    page,
  }) => {
    test.fail(true, "Known defect: '/dimensions?rooms=0' currently renders instead of redirecting to home.");

    await test.step("Open the invalid dimensions URL", async () => {
      await page.goto("/dimensions?rooms=0");
      await expect(page).toHaveURL(/\/$/);
      await homePage.expectLoaded();
    });
  });

  test("rejects direct navigation with a negative room count [PW-014] @bug", async ({
    homePage,
    page,
  }) => {
    test.fail(
      true,
      "Known defect: negative room counts are currently sanitized into positive values instead of being rejected."
    );

    await test.step("Open the invalid dimensions URL", async () => {
      await page.goto("/dimensions?rooms=-2");
      await expect(page).toHaveURL(/\/$/);
      await homePage.expectLoaded();
    });
  });

  test("handles a non-numeric room count gracefully [PW-015] @bug", async ({
    homePage,
    page,
  }) => {
    test.fail(true, "Known defect: non-numeric room counts currently trigger a server error.");

    await test.step("Open the invalid dimensions URL and verify it is handled", async () => {
      const response = await page.goto("/dimensions?rooms=abc");
      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(500);
      await expect(page).toHaveURL(/\/$/);
      await homePage.expectLoaded();
    });
  });
});
