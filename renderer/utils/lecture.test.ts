import { Lecture } from "../interfaces";
import { saveLecture, loadLecture } from "./lecture";

function saveLectureTest(quater: number = 0) {
  const testdata0: Lecture[] = [
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
  const testdata1: Lecture[] = [
    {
      id: 4,
      name: "こうぎ4",
      dates: [
        { dayOfWeek: 1, period: [3, 4] },
        { dayOfWeek: 3, period: [1, 2] },
      ],
      memo: [{ title: "zoom", text: "https://C" }],
    },
    {
      id: 5,
      name: "こうぎ5",
      dates: [{ dayOfWeek: 4, period: [1, 2, 5, 6] }],
      memo: [{ title: "zoom", text: "https://D" }],
    },
  ];
  localStorage.clear();
  saveLecture(testdata0, quater);
  loadLectureTest(testdata0, quater);
  loadLectureTest([], (quater + 1) % 4);
  loadLectureTest([], (quater + 2) % 4);
  loadLectureTest([], (quater + 3) % 4);

  saveLecture(testdata1, (quater + 1) % 4);
  loadLectureTest(testdata0, quater);
  loadLectureTest(testdata1, (quater + 1) % 4);
  loadLectureTest([], (quater + 2) % 4);
  loadLectureTest([], (quater + 3) % 4);

  expect(Object.keys(localStorage.__STORE__).length).toBe(2);
}
function loadLectureTest(expect_lec: Lecture[], quater: number) {
  const data: Lecture[] = loadLecture(quater);
  const datastr: string = JSON.stringify(data);
  const expectstr: string = JSON.stringify(expect_lec);
  expect(datastr).toBe(expectstr);
}

describe("test lecture saveload", () => {
  test("with simple data", () => {
    // このライブラリ使うのやめて新しくモック作るのも一案かもしれない
    // @ts-ignore
    localStorage.setItem.mockClear();
    loadLectureTest([], 0);
    saveLectureTest();
  });
});
