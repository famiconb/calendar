import { useCallback, useEffect, useState } from "react";
import { Lecture } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";

type UseLectureDataType = (quarter: number) => {
  lectures?: Lecture[];
  save: (_: Lecture[]) => void;
  initialized: boolean;
};

/**
 * Saving and loading wrapper for lecture data in localstorage
 *
 * When window is not defined, `save` throws error and `load` returns undefined
 *
 * @example
 * const { lectures } = useLectureData();
 * return lectures != null ? <div>lectures[0].name</div> : <div>"loading..."</div>;
 */
export const useLectureData: UseLectureDataType = (quarter: number) => {
  const [lectureData, setLectureData] = useState<Lecture[] | undefined>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const f = () => {
      if (typeof window !== "undefined") {
        setInitialized(true);
        setLectureData(loadLecture(quarter));
      } else {
        setTimeout(f, 10);
      }
    };
    f();
  }, [quarter]);

  const save = useCallback(
    (data: Lecture[]) => {
      if (!initialized) {
        throw new Error("Cannot call save function before initialization");
      }
      setLectureData(data);
      saveLecture(data, quarter);
    },
    [initialized, quarter]
  );

  return { save, initialized, lectures: lectureData };
};
