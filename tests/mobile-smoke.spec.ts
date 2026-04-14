import { devices } from "@playwright/test";

import { validSingleRoomScenario } from "./data/calculation-scenarios";
import { test } from "./fixtures";
import { submitCalculation } from "./support/paint-calculator.flow";

const iPhone13 = devices["iPhone 13"];

test.use({
  viewport: iPhone13.viewport,
  userAgent: iPhone13.userAgent,
  deviceScaleFactor: iPhone13.deviceScaleFactor,
  isMobile: iPhone13.isMobile,
  hasTouch: iPhone13.hasTouch,
});

test("keeps the core flow usable on a mobile viewport [PW-017] @regression", async ({
  homePage,
  dimensionsPage,
  resultsPage,
}) => {
  await test.step("Run a valid calculation on the mobile layout", async () => {
    await submitCalculation(homePage, dimensionsPage, resultsPage, validSingleRoomScenario.rooms);
    await resultsPage.openResultsModal();
    await resultsPage.waitForCalculationResponse();
    await resultsPage.expectResultsPopulated(validSingleRoomScenario.rooms.length);
  });
});
