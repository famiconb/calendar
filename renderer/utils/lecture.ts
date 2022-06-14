import { Lecture } from "../interfaces";

const STORAGE_KEY = "CUCalendar_";

/**
 * @param quater: 0,1,2,3のどれか
 */
export function loadLecture(quater: number = 0): Lecture[] {
  const data_str = localStorage.getItem(STORAGE_KEY + quater.toString());
  if (data_str === null) {
    return [];
  }
  return JSON.parse(data_str) as Lecture[];
}
export function saveLecture(lectures: Lecture[], quater: number = 1) {
  const data_str: string = JSON.stringify(lectures);
  localStorage.setItem(STORAGE_KEY + quater.toString(), data_str);
  return;
}
