import { Lecture } from "../interfaces";

const STORAGE_KEY = "CUCalendar_";

/**
 * @param quarter: 0,1,2,3のどれか
 */
export function loadLecture(quarter: number = 0): Lecture[] {
  const data_str = localStorage.getItem(STORAGE_KEY + quarter.toString());
  if (data_str === null) {
    return [];
  }
  return JSON.parse(data_str) as Lecture[];
}
export function saveLecture(lectures: Lecture[], quarter: number = 0) {
  const data_str: string = JSON.stringify(lectures);
  localStorage.setItem(STORAGE_KEY + quarter.toString(), data_str);
  return;
}
