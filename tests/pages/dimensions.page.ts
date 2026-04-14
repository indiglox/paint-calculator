import { expect, Locator, Page } from "@playwright/test";

import type { RoomDimensions } from "../data/calculation-scenarios";

type DimensionField = "length" | "width" | "height";

export class DimensionsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Calculating Paint Required" });
    this.table = page.locator('table[name="dimensions_table"]');
    this.submitButton = page.locator('form[action="results"] input[type="submit"]');
  }

  private fieldInput(field: DimensionField, roomIndex: number) {
    return this.page.locator(`input[name="${field}-${roomIndex}"]`);
  }

  private roomRows() {
    return this.table.locator("tr").filter({ has: this.page.locator('input[type="number"]') });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.table).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectRoomRows(count: number) {
    await expect(this.roomRows()).toHaveCount(count);
  }

  async fillRooms(rooms: RoomDimensions[]) {
    for (const [index, room] of rooms.entries()) {
      await this.fieldInput("length", index).fill(String(room.length));
      await this.fieldInput("width", index).fill(String(room.width));
      await this.fieldInput("height", index).fill(String(room.height));
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectFieldValueMissing(field: DimensionField, roomIndex = 0) {
    const isMissing = await this.fieldInput(field, roomIndex).evaluate((element) => {
      const input = element as HTMLInputElement;
      return input.validity.valueMissing && !input.checkValidity();
    });
    expect(isMissing).toBe(true);
  }
}
