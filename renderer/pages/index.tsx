import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import { useQuarter } from "../hooks/useQuarter";
import React from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";

/**
 * 講義情報の行を表示
 * @param number 何行目
 * @param lectures 講義情報
 * @returns number行目の時間割情報を表示
 */
const row_view = (number: number, lectures: Lecture[], quarter: number) => {
  // 時間割のnumber限目の列
  const row = [];

  // 講義時間帯
  const lecture_time = (number: number) => {
    const times = [
      "",
      "8:50-9:40",
      "9:40-10:30",
      "10:45-11:35",
      "11:35-12:25",
      "14:20-15:10",
      "15:10-16:00",
      "16:15-17:05",
      "17:05-17:55",
    ];
    return times[number];
  };

  // dayOfWeek 何曜日
  for (let dayOfWeek = 0; dayOfWeek < 6; dayOfWeek++) {
    if (dayOfWeek == 0) {
      row.push(
        <th className="border-solid border border-black">
          <p>{number}時限目</p>
          <p className="text-xs">{lecture_time(number)}</p>
        </th>
      );
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
                <Link
                  href={`/lecture-info?id=${lecture.id}&quarter=${quarter}`}
                >
                  <th className="border-solid border border-black h-12">
                    {lecture.name}
                  </th>
                </Link>
              );
              found = true;
            }
          }
        }
      }
      if (!found)
        row.push(<th className="border-solid border h-12 border-black"></th>);
    }
  }
  return <tr>{row}</tr>;
};

const TableHead: React.FC<{ children?: React.ReactNode }> = (props) => (
  <th className="border border-solid border-black w-28 cursor-pointer">
    {props.children}
  </th>
);

/**
 * 表示されていない講義を取得
 * @param lectures
 * @returns
 */
const otherLecture = (lectures: Lecture[], quarter: number) => {
  const others = [];
  const week = ["日", "月", "火", "水", "木", "金", "土", "その他"];
  for (let lectures_i = 0; lectures_i < lectures.length; ++lectures_i) {
    const lecture: Lecture = lectures[lectures_i];
    for (let i = 0; i < lecture.dates.length; ++i) {
      for (let j = 0; j < lecture.dates[i].period.length; ++j) {
        if (
          lecture.dates[i].period[j] > 8 ||
          lecture.dates[i].dayOfWeek == 0 ||
          lecture.dates[i].dayOfWeek == 6 ||
          lecture.dates[i].dayOfWeek == 7
        ) {
          others.push(
            <Link href={`/lecture-info?id=${lecture.id}&quarter=${quarter}`}>
              <tr className="text-center">
                <th> {lecture.name} </th>
                <th> {week[lecture.dates[0].dayOfWeek]} </th>
                <th> {lecture.dates[0].period.join("-")} </th>
              </tr>
            </Link>
          );
          break;
        }
      }
    }
  }
  if (others.length != 0) {
    return <tbody className="whitespace-normal p-1">{others}</tbody>;
  }
};

const IndexPage = () => {
  // queryパラメータからquarterを取る
  const quarter: number = useQuarter();

  // 表示用の講義データ
  const { lectures } = useLectureData(quarter);
  const router = useRouter();

  const prevQ = (quarter - 1 + 4) % 4;
  const nextQ = (quarter + 1) % 4;
  return lectures != null ? (
    <Layout title="CUCalendar">
      <div className="h-screen">
        <div className="p-2 h-full hlex flex-col">
          <div>
            <h1>{quarter + 1}Q の時間割</h1>
            {quarter != 0 ? <Link href="/?quarter=0">[ 1Q ]</Link> : "< 1Q >"}
            {"   "}
            {quarter != 1 ? <Link href="/?quarter=1">[ 2Q ]</Link> : "< 2Q >"}
            {"   "}
            {quarter != 2 ? <Link href="/?quarter=2">[ 3Q ]</Link> : "< 3Q >"}
            {"   "}
            {quarter != 3 ? <Link href="/?quarter=3">[ 4Q ]</Link> : "< 4Q >"}
            <Button
              color="primary"
              className="mx-2 mt-1.5"
              onClick={() =>
                router.push("/add-page?quarter=" + quarter.toString())
              }
            >
              講義追加
            </Button>
          </div>

          <table className="border border-solid w-full">
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
              {row_view(1, lectures, quarter)}
              {row_view(2, lectures, quarter)}
              {row_view(3, lectures, quarter)}
              {row_view(4, lectures, quarter)}
              {row_view(5, lectures, quarter)}
              {row_view(6, lectures, quarter)}
              {row_view(7, lectures, quarter)}
              {row_view(8, lectures, quarter)}
            </tbody>
          </table>
          <div className="overflow-auto">
            <br></br>
            <h3>その他の講義</h3>
            <div className="border-double border-4 border-black flex-grow">
              <table className="w-full items-center cursor-pointer">
                <thead>
                  <tr className="border-b border-black bg-gray-400">
                    <th>講義名</th>
                    <th>曜日</th>
                    <th>時間</th>
                  </tr>
                </thead>
                {otherLecture(lectures, quarter)}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default IndexPage;
