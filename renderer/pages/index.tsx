import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React from "react";
import { useRouter } from "next/router";

/// 各表の行を表示する
/// number 何限目
/// lecture 講義データ Demo
const row_view = (number: number, lectures: Lecture[]) => {
  // 時間割のnumber限目の列
  const row = [];

  // dayOfWeek 何曜日
  for (let dayOfWeek = 0; dayOfWeek < 6; dayOfWeek++) {
    if (dayOfWeek == 0) {
      row.push(<th style={{ border: "solid 1px" }}>{number + "時限目"}</th>);
    } else {
      let found = false;
      for (let lectures_i = 0; lectures_i < lectures.length; ++lectures_i) {
        const lecture: Lecture = lectures[lectures_i];
        for (let i = 0; i < lecture.dates.length; ++i) {
          for (let j = 0; j < lecture.dates[i].period.length; ++j) {
            if (
              lecture.dates[i].period[j] == number &&
              lecture.dates[i].dayOfWeek == dayOfWeek
            ) {
              row.push(
                <th style={{ height: "50px", border: "solid 1px" }}>
                  <Link href={`/lecture-info?id=${lecture.id}`}>
                    {lecture.name}
                  </Link>
                </th>
              );
              found = true;
            }
          }
        }
      }
      if (!found)
        row.push(<th style={{ height: "50px", border: "solid 1px" }}></th>);
    }
  }
  return <tr>{row}</tr>;
};

//// 表示用の講義データ
// const lectures: Lecture[] = [
//   {
//     id: 0,
//     name: "システム開発基礎",
//     dates: [{ dayOfWeek: 2, period: [5, 6, 7, 8] }],
//     memo: [{ title: "zoom", text: "https://A" }],
//   },
// ];

const TableHead: React.FC<{ children?: React.ReactNode }> = (props) => (
  <th className="border border-solid border-black w-28">{props.children}</th>
);

const IndexPage = () => {
  // イベントクリック 今は無用のもの
  // const onSelectEvent = useCallback((calEvent) => {
  //   window.alert(calEvent.title);
  // }, []);

  // 表示用の講義データ
  const { lectures } = useLectureData();
  const router = useRouter();

  return lectures != null ? (
    <Layout title="CUCalendar">
      <button
        className="border rounded-sm border-black p-0.5 mx-2 mt-1.5 -my-0.5"
        onClick={() => router.push("/add-page")}
      >
        講義追加
      </button>
      <div
        className="p-2 w-screen h-screen"
        style={{ height: "calc(100vh - 2.25rem)" }}
      >
        <table className="border border-solid w-full h-full">
          <thead>
            <tr>
              <TableHead></TableHead>
              <TableHead>月</TableHead>
              <TableHead>火</TableHead>
              <TableHead>水</TableHead>
              <TableHead>木</TableHead>
              <TableHead>金</TableHead>
            </tr>
          </thead>
          <tbody>
            {row_view(1, lectures)}
            {row_view(2, lectures)}
            {row_view(3, lectures)}
            {row_view(4, lectures)}
            {row_view(5, lectures)}
            {row_view(6, lectures)}
            {row_view(7, lectures)}
            {row_view(8, lectures)}
          </tbody>
        </table>
      </div>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default IndexPage;
