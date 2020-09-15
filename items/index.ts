import equipment from "./equipment.json";
import { RawItem } from "../types";
export * from "./transform";
export const items = equipment as { [index: string]: RawItem };
