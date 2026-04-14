import { expect, Locator, Page, Response } from "@playwright/test";

import type { ExpectedRoomResult } from "../data/calculation-scenarios";

export class ResultsPage {
  readonly page: Page;
  readonly viewResultsButton: Locator;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly resultsTable: Locator;
  readonly totalGallons: Locator;
  readonly closeButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewResultsButton = page.getByRole("button", { name: "View Results" });
    this.modal = page.locator("#resultsModal");
    this.modalTitle = this.modal.getByRole("heading", { name: "Paint Calculation Results" });
    this.resultsTable = this.modal.locator('table[name="Results"]');
    this.totalGallons = page.locator("#sumGallons");
    this.closeButton = this.modal.getByRole("button", { name: "Close" });
    this.homeButton = page.locator('input[type="submit"][value="Home"]');
  }

  private row(roomId: string) {
    return this.page.locator(`tr[id="${roomId}"]`);
  }

  async expectLoaded() {
    await expect(this.viewResultsButton).toBeVisible();
    await expect(this.homeButton).toBeVisible();
  }

  async openResultsModal() {
    await this.viewResultsButton.click();
    await expect(this.modalTitle).toBeVisible();
    await expect(this.resultsTable).toBeVisible();
  }

  async waitForCalculationResponse(): Promise<Response> {
    const response = await this.page.waitForResponse(
      (candidate) =>
        candidate.url().includes("/api/v1/calculate") &&
        candidate.request().method() === "POST",
      { timeout: 10_000 }
    );
    expect(response.ok()).toBeTruthy();
    await expect(this.totalGallons).not.toHaveText("Total Gallons Required: ");
    return response;
  }

  async expectResultsStructure() {
    await expect(this.modalTitle).toBeVisible();
    await expect(this.resultsTable).toBeVisible();
    await expect(this.totalGallons).toContainText("Total Gallons Required:");
  }

  async expectResultsPopulated(roomCount: number) {
    for (let roomIndex = 1; roomIndex <= roomCount; roomIndex += 1) {
      const row = this.row(`room-${roomIndex}`);
      await expect(row.locator("td").nth(0)).not.toHaveText("");
      await expect(row.locator("td").nth(1)).not.toHaveText("");
      await expect(row.locator("td").nth(2)).not.toHaveText("");
    }
    await expect(this.totalGallons).not.toHaveText("Total Gallons Required: ");
  }

  async expectRoomResult(indexOrId: number | string, expected: ExpectedRoomResult) {
    const roomId = typeof indexOrId === "number" ? `room-${indexOrId}` : indexOrId;
    const row = this.row(roomId);
    await expect(row.locator("td").nth(0)).toHaveText(expected.roomNumber);
    await expect(row.locator("td").nth(1)).toHaveText(String(expected.feet));
    await expect(row.locator("td").nth(2)).toHaveText(String(expected.gallons));
  }

  async expectTotalGallons(total: number) {
    await expect(this.totalGallons).toHaveText(`Total Gallons Required: ${total}`);
  }

  async closeModal() {
    await this.closeButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async goHome() {
    await this.homeButton.click();
  }
}
