import type { RoomDimensions } from "../data/calculation-scenarios";
import type { DimensionsPage } from "../pages/dimensions.page";
import type { HomePage } from "../pages/home.page";
import type { ResultsPage } from "../pages/results.page";

export async function goToDimensions(
  homePage: HomePage,
  dimensionsPage: DimensionsPage,
  roomCount: number
) {
  await homePage.goto();
  await homePage.enterRoomCount(roomCount);
  await homePage.submit();
  await dimensionsPage.expectRoomRows(roomCount);
}

export async function submitCalculation(
  homePage: HomePage,
  dimensionsPage: DimensionsPage,
  resultsPage: ResultsPage,
  rooms: RoomDimensions[]
) {
  await goToDimensions(homePage, dimensionsPage, rooms.length);
  await dimensionsPage.fillRooms(rooms);
  await dimensionsPage.submit();
  await resultsPage.expectLoaded();
}
