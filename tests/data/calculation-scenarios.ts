export type RoomDimensions = {
  length: number;
  width: number;
  height: number;
};

export type ExpectedRoomResult = {
  roomNumber: string;
  feet: number;
  gallons: number;
};

export type CalculationScenario = {
  name: string;
  rooms: RoomDimensions[];
  expectedRooms?: ExpectedRoomResult[];
  expectedTotalGallons?: number;
};

export type InvalidRouteScenario = {
  name: string;
  value: string;
};

export const validSingleRoomScenario: CalculationScenario = {
  name: "one valid room",
  rooms: [{ length: 10, width: 12, height: 8 }],
};

export const validTwoRoomScenario: CalculationScenario = {
  name: "two valid rooms",
  rooms: [
    { length: 10, width: 12, height: 8 },
    { length: 5, width: 6, height: 7 },
  ],
};

export const specSingleRoomScenario: CalculationScenario = {
  name: "single room matches published surface-area formula",
  rooms: [{ length: 10, width: 12, height: 8 }],
  expectedRooms: [{ roomNumber: "1", feet: 352, gallons: 1 }],
  expectedTotalGallons: 1,
};

export const specMultiRoomScenario: CalculationScenario = {
  name: "multi-room total rounds up per room",
  rooms: [
    { length: 5, width: 6, height: 7 },
    { length: 6, width: 7, height: 8 },
  ],
  expectedRooms: [
    { roomNumber: "1", feet: 154, gallons: 1 },
    { roomNumber: "2", feet: 208, gallons: 1 },
  ],
  expectedTotalGallons: 2,
};

export const invalidRouteScenarios: InvalidRouteScenario[] = [
  { name: "zero room count", value: "0" },
  { name: "negative room count", value: "-2" },
  { name: "non-numeric room count", value: "abc" },
];
