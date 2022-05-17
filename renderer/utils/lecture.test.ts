import { Lecture } from "../interfaces";
import { saveLecture, loadLecture } from "./lecture";

export function saveLectureTest() {
  const testdata: Lecture[] = [
    {
      id: 0,
      name: "こうぎ1",
      dates: [{ dayOfWeek: 1, period: [3, 4] }],
      memo: [{ title: "zoom", text: "https://A" }],
    },
    {
      id: 2,
      name: "こうぎ9",
      dates: [{ dayOfWeek: 4, period: [1, 2] }],
      memo: [{ title: "zoom", text: "https://B" }],
    },
  ];

  localStorage.clear();
  saveLecture(testdata);
  loadLectureTest(testdata);
}
export function loadLectureTest(expect: Lecture[]) {
  const data: Lecture[] = loadLecture();
  const datastr: string = JSON.stringify(data);
  const expectstr: string = JSON.stringify(expect);
  console.log(datastr);
  console.log(expectstr);
  console.log(datastr === expectstr);
  return datastr === expectstr;
}

describe("test lecture saveload", () => {
  test("with simple data", () => {
    localStorage.setItem.mockClear();
    expect(loadLectureTest([]));
    expect(saveLectureTest());
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });
});