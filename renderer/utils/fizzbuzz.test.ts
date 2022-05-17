import "./fizzbuzz";
import { createFizzBuzzArray } from "./fizzbuzz";

describe("test fizzbuzz function", () => {
  test("with 1~5 elements", () => {
    const result = createFizzBuzzArray(5);
    expect(result[0]).toBe("1");
    expect(result[2]).toBe("Fizz");
    expect(result[4]).toBe("Buzz");
  });

  test("with 1~15 elements", () => {
    const result = createFizzBuzzArray(15);
    expect(result[1]).toBe("2");
    expect(result[14]).toBe("FizzBuzz");
  });
});
