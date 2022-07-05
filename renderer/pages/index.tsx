import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";

/**
 * 講義情報の行を表示
 * @param number 何行目
 * @param lectures 講義情報
 * @returns number行目の時間割情報を表示
 */
const row_view = (number: number, lectures: Lecture[]) => {
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
                <Link href={`/lecture-info?id=${lecture.id}`}>
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
  <th className="border border-solid border-black w-28">{props.children}</th>
);

/**
 * 表示されていない講義を取得
 * @param lectures
 * @returns
 */
const otherLecture = (lectures: Lecture[]) => {
  const others = [];
  for (let lectures_i = 0; lectures_i < lectures.length; ++lectures_i) {
    const lecture: Lecture = lectures[lectures_i];
    for (let i = 0; i < lecture.dates.length; ++i) {
      for (let j = 0; j < lecture.dates[i].period.length; ++j) {
        if (
          lecture.dates[i].period[j] > 8 ||
          lecture.dates[i].dayOfWeek == 0 ||
          lecture.dates[i].dayOfWeek == 6
        ) {
          others.push(
            <Link href={`/lecture-info?id=${lecture.id}`}>
            <tr className="text-center">
              <th> {lecture.name} </th>
              <th> {lecture.dates[0].dayOfWeek} </th>
              <th> {lecture.dates[0].period} </th>
            </tr>
            </Link>) 
          break;
        }
      }
    }
  }
  if (others.length != 0) {
    return <tbody className="whitespace-normal p-1">{others}</tbody>
  }
};

const IndexPage = () => {
  // 表示用の講義データ
  const { lectures } = useLectureData();
  const router = useRouter();

  return lectures != null ? (
    <Layout title="CUCalendar">
      <div className="h-screen">
        <div className="p-2 h-full hlex flex-col">
          <div>
            <Button
              color="primary"
              className="mx-2 mt-1.5"
              onClick={() => router.push("/add-page")}
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
          <div className="overflow-auto">
            <br></br>
            <h3>その他の講義</h3>
            <div className="border-double border-4 border-black flex-grow">
              <table className="w-full items-center">
                <thead>
                    <tr className="border-b border-black">
                        <th>講義名</th>
                        <th>ようび</th>
                        <th>時間</th>
                    </tr>
                </thead>
                    {otherLecture(lectures)}
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
