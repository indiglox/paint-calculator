import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly roomPrompt: Locator;
  readonly roomCountInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Calculating Paint Required" });
    this.roomPrompt = page.getByText("Enter the number of rooms");
    this.roomCountInput = page.locator('input[name="rooms"]');
    this.submitButton = page.locator('form[action="dimensions"] input[type="submit"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.heading).toBeVisible();
    await expect(this.roomPrompt).toBeVisible();
    await expect(this.roomCountInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async enterRoomCount(count: number | string) {
    await this.roomCountInput.fill(String(count));
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectRoomCountRequired() {
    await expect(this.page).toHaveURL(/\/$/);
    const isMissing = await this.roomCountInput.evaluate((element) => {
      const input = element as HTMLInputElement;
      return input.validity.valueMissing && !input.checkValidity();
    });
    expect(isMissing).toBe(true);
  }
}
