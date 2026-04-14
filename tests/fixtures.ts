import { test as base, expect } from "@playwright/test";

import { DimensionsPage } from "./pages/dimensions.page";
import { HomePage } from "./pages/home.page";
import { ResultsPage } from "./pages/results.page";

type PaintCalculatorFixtures = {
  homePage: HomePage;
  dimensionsPage: DimensionsPage;
  resultsPage: ResultsPage;
};

export const test = base.extend<PaintCalculatorFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  dimensionsPage: async ({ page }, use) => {
    await use(new DimensionsPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
});

export { expect };
