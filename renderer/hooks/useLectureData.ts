import { useCallback, useEffect, useState } from "react";
import { Lecture } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";

type UseLectureDataType = () => {
  load: () => Lecture[] | undefined;
  save: (_: Lecture[]) => void;
  initialized: boolean;
};

/**
 * Saving and loading wrapper for lecture data in localstorage
 *
 * When window is not defined, `save` throws error and `load` returns undefined
 */
export const useLectureData: UseLectureDataType = () => {
  const [lectureData, setLectureData] = useState<Lecture[] | undefined>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const f = () => {
      if (typeof window !== "undefined") {
        setInitialized(true);
        setLectureData(loadLecture());
      } else {
        setTimeout(f, 10);
      }
    };
    f();
  }, []);

  const save = useCallback(
    (data: Lecture[]) => {
      if (!initialized) {
        throw new Error("Cannot call save function before initialization");
      }
      setLectureData(data);
      saveLecture(data);
    },
    [initialized]
  );

  const load = useCallback((): Lecture[] | undefined => {
    if (!initialized) {
      return undefined;
    }
    return lectureData;
  }, [initialized, lectureData]);

  return { load, save, initialized };
};
