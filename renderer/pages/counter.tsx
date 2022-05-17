import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const Counter = () => {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const factorial2 = useMemo(() => {
    let ans = 1;
    for (let i = 0; i < value; i++) {
      ans *= i + 1;
    }
    return ans;
  }, [value]);

  const factorial = useCallback(() => {
    let ans = 1;
    for (let i = 0; i < value; i++) {
      ans *= i + 1;
    }
    return ans;
  }, [value]);

  const _factorial = () => {
    let ans = 1;
    for (let i = 0; i < value; i++) {
      ans *= i + 1;
    }
    return ans;
  };

  useEffect(() => {
    if (value % 5 == 0) {
      alert(value);
    }
  }, [value]);

  console.log(factorial);

  return (
    <div>
      <button onClick={() => setValue((x) => x + 1)}>Up</button>
      <button onClick={() => setValue((x) => x - 1)}>Down</button>
      <div>{value}</div>
      <div>fact: {_factorial()}</div>
      <div>fact_memo: {factorial2}</div>
      <div>{factorial()}</div>
      <>Hello, world!</>
      <button onClick={() => router.push("/")}>Fe</button>
    </div>
  );
};

export default Counter;
