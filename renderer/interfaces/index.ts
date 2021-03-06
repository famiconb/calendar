// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpcRenderer } from "electron";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

export type User = {
  id: number;
  name: string;
};

export type LectureDate = {
  dayOfWeek: number; // 0=="日", 1=="月", ...
  period: number[]; //3,4限なら =[3,4]
};
export type LectureMemo = {
  title: string; // "zoom url"
  text: string; // "ttps://~"
};
export type Lecture = {
  id: number;
  name: string;
  code: string; //科目コード
  dates: LectureDate[];
  memo: LectureMemo[];
};
