import { specMultiRoomScenario, specSingleRoomScenario } from "./data/calculation-scenarios";
import { test } from "./fixtures";
import { submitCalculation } from "./support/paint-calculator.flow";

test.describe("Published business rules coverage", () => {
  test("matches the published single-room math [PW-009] @bug", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    test.fail(true, "Known defect: the API calculation does not match the published formula and rounding rules.");

    await test.step("Run the published single-room scenario and inspect the result", async () => {
      await submitCalculation(homePage, dimensionsPage, resultsPage, specSingleRoomScenario.rooms);
      await resultsPage.openResultsModal();
      await resultsPage.waitForCalculationResponse();
      await resultsPage.expectRoomResult(1, specSingleRoomScenario.expectedRooms![0]);
      await resultsPage.expectTotalGallons(specSingleRoomScenario.expectedTotalGallons!);
    });
  });

  test("rounds gallons up per room and totals them correctly [PW-010] @bug", async ({
    homePage,
    dimensionsPage,
    resultsPage,
  }) => {
    test.fail(true, "Known defect: the API uses different area math and does not round gallons up per room.");

    await test.step("Run the published two-room scenario and inspect the result", async () => {
      await submitCalculation(homePage, dimensionsPage, resultsPage, specMultiRoomScenario.rooms);
      await resultsPage.openResultsModal();
      await resultsPage.waitForCalculationResponse();
      await resultsPage.expectRoomResult(1, specMultiRoomScenario.expectedRooms![0]);
      await resultsPage.expectRoomResult(2, specMultiRoomScenario.expectedRooms![1]);
      await resultsPage.expectTotalGallons(specMultiRoomScenario.expectedTotalGallons!);
    });
  });
});
