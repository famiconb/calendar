/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useLectureData } from "./useLectureData";

describe("test useLecutureData hook", () => {
  test("initializing", () => {
    const { result } = renderHook(useLectureData);
    setTimeout(() => {
      expect(result.current.initialized).toBeTruthy();
    });
  });
  test("save lecture data testing with empty data after initialized", () => {
    const { result } = renderHook(useLectureData);
    setTimeout(() => {
      expect(result.current.lectures).toBeUndefined();
      const data = {
        id: 0,
        memo: [],
        name: "Doughnut",
        dates: [
          {
            dayOfWeek: 2,
            period: [1, 2],
          },
        ],
      };

      result.current.save([{ ...data }]);
      expect(result.current.lectures).toEqual([data]);
    });
  });
});
