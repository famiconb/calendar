import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import DayOfWeeks from "./DayOfWeeks";

describe("test DayOfWeeks component", () => {
  test("select sunday and tuesday with handler", () => {
    let lastDows: number[] = [];
    const handler = (dows: number[]) => {
      lastDows = dows;
    };

    render(<DayOfWeeks onDayOfWeeksChange={handler} />);
    const checkSundayInputElement = screen.getByRole("checkbox", {
      name: "日",
    });
    const checkTuesdayInputElement = screen.getByRole("checkbox", {
      name: "火",
    });

    expect(checkSundayInputElement).toBeInTheDocument();
    expect(checkTuesdayInputElement).toBeInTheDocument();

    fireEvent.click(checkSundayInputElement);
    fireEvent.click(checkTuesdayInputElement);

    expect(lastDows).toContain(0);
    expect(lastDows).toContain(2);
    expect(lastDows).toHaveLength(2);
  });

  test("select sunday after others selected", () => {
    let lastDows: number[] = [];
    const handler = (dows: number[]) => {
      lastDows = dows;
    };

    render(<DayOfWeeks onDayOfWeeksChange={handler} />);
    const checkSundayInputElement = screen.getByRole("checkbox", {
      name: "日",
    });
    const checkOtherInputElement = screen.getByRole("checkbox", {
      name: "その他",
    });

    fireEvent.click(checkOtherInputElement);
    expect(lastDows).toContain(7);
    expect(lastDows).toHaveLength(1);

    fireEvent.click(checkSundayInputElement);
    expect(lastDows).toContain(0);
    expect(lastDows).toHaveLength(1);
  });

  test("select other after some weekday selected", () => {
    let lastDows: number[] = [];
    const handler = (dows: number[]) => {
      lastDows = dows;
    };

    render(<DayOfWeeks onDayOfWeeksChange={handler} />);
    const checkSundayInputElement = screen.getByRole("checkbox", {
      name: "日",
    });
    const checkFridayInputElement = screen.getByRole("checkbox", {
      name: "金",
    });
    const checkOtherInputElement = screen.getByRole("checkbox", {
      name: "その他",
    });

    fireEvent.click(checkSundayInputElement);
    fireEvent.click(checkFridayInputElement);

    expect(lastDows).toHaveLength(2);

    fireEvent.click(checkOtherInputElement);
    expect(lastDows).toContain(7);
    expect(lastDows).toHaveLength(1);
  });
});
