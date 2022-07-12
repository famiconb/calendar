import { useRouter } from "next/router";

// queryパラメータからquarterを取る
export function useQuarter(): number {
  const router = useRouter();
  const query_quarter_raw = router.query["quarter"];
  const quarter: number =
    query_quarter_raw === undefined
      ? 0
      : parseInt(
          //変な文字でも0になるので例外処理は不要
          Array.isArray(query_quarter_raw)
            ? query_quarter_raw[0]
            : query_quarter_raw
        );
  return quarter;
}

interface Returns {
  year: number;
  quarter: number;
  rawQuarter: number;
}

// o-indexed
export const useQuarterWithYears = (): Returns => {
  const rawQuarter = useQuarter();
  return {
    year: Math.floor(rawQuarter / 4),
    quarter: rawQuarter % 4,
    rawQuarter,
  };
};
