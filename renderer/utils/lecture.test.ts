import { Lecture } from "../interfaces";
import { saveLecture, loadLecture } from "./lecture";


export function saveLectureTest() {
    const testdata: Lecture[] = [
        {
        id: 0,
        name: "こうぎ1",
        dates: [{dayOfWeek: 1, period:[3,4]}],
        memo: [{title: "zoom", text:"https://A"}],
        },
        {
        id: 2,
        name: "こうぎ9",
        dates: [{dayOfWeek: 4, period:[1,2]}],
        memo: [{title: "zoom", text:"https://B"}],
        },
    ];

    localStorage.clear()
    saveLecture(testdata)
    const data: Lecture[] = loadLecture()
    const datastr: string = JSON.stringify(data)
    const testdatastr: string = JSON.stringify(testdata)
    global.ipcRenderer.send("message", datastr);
    global.ipcRenderer.send("message", testdatastr);
    global.ipcRenderer.send("message", datastr === testdatastr);
    return datastr === testdatastr;
}

describe("test lecture saveload", () => {
test("with simple data", () => {
    //expect(saveLectureTest()) //localstrageが使えない
});

});
  