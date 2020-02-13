import { format } from "d3";

export const N_PER_COUNT = 10000;
export const N_PER_COUNT_STRING = "10.000";
export const freqToFormattedPerCount = freq => format(".2")(N_PER_COUNT * freq);
