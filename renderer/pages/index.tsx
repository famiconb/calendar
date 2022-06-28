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
                <th className="border-solid border border-black h-12">
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
          others.push(lecture);
          break;
        }
      }
    }
  }
  if (others.length != 0) {
    const disp = [];
    for (let i = 0; i < others.length; i++) {
      const lecture = others[i]
      const link = lecture.name +  ":曜日" + lecture.dates[0].dayOfWeek + ":時間" + lecture.dates[0].period
      disp.push(
        <p><Link href={`/lecture-info?id=${lecture.id}`}>{link}</Link></p>
      );
    }
    return <div> {disp} </div>;
  }
};

const IndexPage = () => {
  // 表示用の講義データ
  const { lectures } = useLectureData();
  const router = useRouter();

  return lectures != null ? (
    <Layout title="CUCalendar">
      <Button
        color="primary"
        className="mx-2 mt-1.5"
        onClick={() => router.push("/add-page")}
      >
        講義追加
      </Button>
      <div className="p-2 h-full">
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
        <div className="h-20 overflow-auto border-double border-4 border-black">
          <div className="whitespace-normal p-1">
            {otherLecture(lectures)}
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default IndexPage;
