// src/frontend/shared/constants/genders.ts
export const Gender = {
  MALE: "male",
  FEMALE: "female",
} as const;

export const GENDER_LIST = Object.values(Gender);
export type Gender = (typeof Gender)[keyof typeof Gender];
