import { Lecture } from "../interfaces";

const STORAGE_KEY = "CUCalendar_";

/**
 * @param quarter: 数値
 */
export function loadLecture(quarter: number): Lecture[] {
  const data_str = localStorage.getItem(STORAGE_KEY + quarter.toString());
  if (data_str === null) {
    return [];
  }
  return JSON.parse(data_str) as Lecture[];
}
export function saveLecture(lectures: Lecture[], quarter: number) {
  const data_str: string = JSON.stringify(lectures);
  localStorage.setItem(STORAGE_KEY + quarter.toString(), data_str);
  return;
}
