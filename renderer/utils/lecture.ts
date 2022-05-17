import { Lecture } from "../interfaces";

const STORAGE_KEY = "CUCalendar"

export function loadLecture(): Lecture[] {
  const data_str = localStorage.getItem(STORAGE_KEY)
  if (data_str === null) { return []; }
  return JSON.parse(data_str) as Lecture[];
}
export function saveLecture(lectures: Lecture[]) {
  const data_str: string = JSON.stringify(lectures)
  localStorage.setItem(STORAGE_KEY, data_str)
  return;
}
