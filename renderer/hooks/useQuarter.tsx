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
  return  quarter;
}