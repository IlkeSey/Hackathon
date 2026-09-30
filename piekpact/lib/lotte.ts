import { generateYear } from "./household";
import { suggestedCap } from "./capacity";

// Lotte's year and her suggested Piekpact cap, computed once and shared by all screens.
export const LOTTE_DAYS = generateYear();
export const LOTTE_CAP = suggestedCap(LOTTE_DAYS);
