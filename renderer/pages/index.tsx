import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import { useQuarterWithYears } from "../hooks/useQuarter";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import clsx from "clsx";

const availableColors = [
  "bg-orange-300",
  "bg-pink-300",
  "bg-lime-400",
  "bg-indigo-400",
  "bg-fuchsia-400",
  "bg-rose-400",
  "bg-purple-300",
  "bg-green-200",
  "bg-amber-600",
  "bg-blue-400",
  "bg-gray-400",
];

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
                  <th
                    className={clsx(
                      "border-solid border border-black h-12  cursor-pointer",
                      availableColors[lecture.id % availableColors.length]
                    )}
                  >
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

const QuarterButtonClassPrimary =
  "mx-1 mt-1.5 bg-gray-100 border-2 border-gray-500";
const QuarterButtonClassSecondary =
  "mx-1 mt-1.5 bg-gray-100 border-4 border-blue-500";

const IndexPage = () => {
  // queryパラメータからquarterを取る
  const { quarter, rawQuarter, year } = useQuarterWithYears();
  useEffect(() => {
    console.log({ quarter, rawQuater: rawQuarter, year });
  }, [quarter, rawQuarter, year]);

  // 表示用の講義データ
  const { lectures } = useLectureData(rawQuarter);
  const router = useRouter();

  return lectures != null ? (
    <Layout title="CUCalendar">
      <div className="h-screen">
        <div className="p-2 h-full hlex flex-col">
          <div>
            <h1 className="text-xl">
              {year + 1}年目/{quarter + 1}Q の時間割
            </h1>
            <span className="space-x-2">
              <select
                onChange={(e) => {
                  const selectedYear = Number(e.target.value);
                  console.log(selectedYear * 4 + quarter);
                  router.push(`/?quarter=${selectedYear * 4 + quarter}`);
                }}
                defaultValue={year}
              >
                <option value={0}>1年目</option>
                <option value={1}>2年目</option>
              </select>
              {[...Array(4).keys()].map((i) => (
                <span key={`quater-link-to-${i}`}>
                  {quarter != i ? (
                    <Button
                      className={QuarterButtonClassPrimary}
                      onClick={() => router.push(`/?quarter=${year * 4 + i}`)}
                    >
                      {i + 1}Q
                    </Button>
                  ) : (
                    <Button className={QuarterButtonClassSecondary}>
                      {i + 1}Q
                    </Button>
                  )}
                </span>
              ))}
            </span>

            <Button
              color="primary"
              className="mx-2 mt-1.5"
              onClick={() => router.push(`/add-page?quarter=${rawQuarter}`)}
            >
              講義追加
            </Button>
          </div>
          <table className="border border-solid w-full my-2">
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
              {[...Array(8).keys()].map((i) =>
                row_view(i + 1, lectures, rawQuarter)
              )}
            </tbody>
          </table>
          <div className="overflow-auto">
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
                {otherLecture(lectures, rawQuarter)}
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
