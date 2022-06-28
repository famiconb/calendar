/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useLectureData } from "./useLectureData";

// window関連で意味のないテストと化している気がします
describe("test useLecutureData hook", () => {
  test("initializing", () => {
    const { result } = renderHook(useLectureData);
    setTimeout(() => {
      expect(result.current.initialized).toBeTruthy();
    }, 15);
  });
  test("save lecture data testing with empty data after initialized", () => {
    const { result } = renderHook(useLectureData);

    setTimeout(() => {
      expect(result.current.lectures).not.toBeUndefined();
      const data = {
        id: 0,
        memo: [],
        name: "Doughnut",
        code: "LAH.A401",
        dates: [
          {
            dayOfWeek: 2,
            period: [1, 2],
          },
        ],
      };

      result.current.save([{ ...data }]);
      expect(result.current.lectures).toEqual([data]);
    }, 15);
  });
});
