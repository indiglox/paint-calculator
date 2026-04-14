import { validSingleRoomScenario, validTwoRoomScenario } from "./data/calculation-scenarios";
import { expect, test } from "./fixtures";
import { goToDimensions, submitCalculation } from "./support/paint-calculator.flow";
import { expectBusinessRulesFooter } from "./support/footer";

test.describe("Smoke and journey coverage", () => {
  test("renders the home page shell [PW-001] @smoke", async ({ homePage }) => {
    await test.step("Load the home page", async () => {
      await homePage.goto();
      await homePage.expectLoaded();
      await expectBusinessRulesFooter(homePage.page);
    });
  });

  test("shows one dimensions row per requested room [PW-002, PW-003] @smoke", async ({
    homePage,
    dimensionsPage,
  }) => {
    await test.step("Request the dimensions form for two rooms", async () => {
      await goToDimensions(homePage, dimensionsPage, validTwoRoomScenario.rooms.length);
      await expect(dimensionsPage.page).toHaveURL(/\/dimensions\?rooms=2$/);
      await dimensionsPage.expectLoaded();
    });
  });

  test("completes a basic calculation and populates the results modal [PW-006, PW-007, PW-008] @smoke", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    await test.step("Submit a valid one-room calculation", async () => {
      await submitCalculation(homePage, dimensionsPage, resultsPage, validSingleRoomScenario.rooms);
    });

    await test.step("Open the modal and verify the calculation is rendered", async () => {
      await resultsPage.openResultsModal();
      await resultsPage.expectResultsStructure();
      await resultsPage.waitForCalculationResponse();
      await resultsPage.expectResultsPopulated(validSingleRoomScenario.rooms.length);
    });
  });

  test("allows the user to dismiss the results modal [PW-011] @regression", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    await test.step("Complete a calculation and open the results modal", async () => {
      await submitCalculation(homePage, dimensionsPage, resultsPage, validSingleRoomScenario.rooms);
      await resultsPage.openResultsModal();
      await resultsPage.waitForCalculationResponse();
      await resultsPage.closeModal();
    });
  });

  test("keeps the published business rules visible across the main pages [PW-016] @regression", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    await test.step("Check the home page footer", async () => {
      await homePage.goto();
      await expectBusinessRulesFooter(homePage.page);
    });

    await test.step("Check the dimensions page footer", async () => {
      await goToDimensions(homePage, dimensionsPage, validSingleRoomScenario.rooms.length);
      await expectBusinessRulesFooter(dimensionsPage.page);
    });

    await test.step("Check the results page footer", async () => {
      await dimensionsPage.fillRooms(validSingleRoomScenario.rooms);
      await dimensionsPage.submit();
      await resultsPage.expectLoaded();
      await expectBusinessRulesFooter(resultsPage.page);
    });
  });
});
