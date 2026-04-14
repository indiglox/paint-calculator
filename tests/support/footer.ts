import { expect, Page } from "@playwright/test";

export async function expectBusinessRulesFooter(page: Page) {
  await expect(page.getByText("1 gallon of paint is required for every 400ft of surface.")).toBeVisible();
  await expect(page.getByText("The surface area to paint is")).toContainText(
    "((Length * 2) + (Width * 2)) * Height"
  );
  await expect(page.getByText("Gallons required will be rounded up.")).toBeVisible();
}
