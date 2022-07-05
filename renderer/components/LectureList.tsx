import Link from "next/link";
import React, { useMemo } from "react";
import { useQuarter } from "../hooks/useQuarter";
import { Lecture, LectureDate, LectureMemo } from "../interfaces";

type Props = {
  lecture: Lecture;
};

const getStringOfDayOfWeek = (item: LectureDate) => {
  switch (item.dayOfWeek) {
    case 0:
      return "日";
    case 1:
      return "月";
    case 2:
      return "火";
    case 3:
      return "水";
    case 4:
      return "木";
    case 5:
      return "金";
    case 6:
      return "土";
    default:
      return "曜日設定が間違っているぞ!!";
  }
};

const getStringOfPeriod = (item: LectureDate) => {
  let tmp: String = "";
  if (item.period.length < 1) {
    return "期間のサイズがおかしい!! : " + item.period.length;
  } else {
    for (let i = 0; i < item.period.length - 1; i++) {
      tmp += item.period[i] + ",";
    }
    tmp += item.period[item.period.length - 1] + "";
    return tmp;
  }
};

const makeHypertext = (str: String): JSX.Element => {
  const strList = str.split(/\s/);
  const element: React.ReactNode[] = [];
  strList.forEach((s: string) => {
    const url = s.match(
      /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/
    );
    if (url != null) {
      element.push(
        <a
          className="underline text-sky-700"
          onClick={() => {
            window.open(url[0], "", "width=800,height=600");
            return false;
          }}
        >
          {url[0]}{" "}
        </a>
      );
    } else {
      element.push(s + " ");
    }
  });
  return <>{element}</>;
};

const LectureList = ({ lecture }: Props) => (
  <div className="m-2.5">
    <h2>講義名: {lecture.name}</h2>
    <h2>科目コード: {lecture.code}</h2>
    <Link href={`/edit-page?id=${lecture.id}&quarter=${useQuarter()}`}>
      edit
    </Link>
    <h3>講義の日程</h3>
    <ul className="pl-2">
      {lecture.dates.map((item, i) => (
        <li key={i}>
          <div>
            <p>
              {getStringOfDayOfWeek(item)}曜日 時限:{getStringOfPeriod(item)}
            </p>
            <p></p>
          </div>
        </li>
      ))}
    </ul>

    <h3>講義に関するメモ</h3>
    <ul className="pl-2 space-y-2">
      {lecture.memo.map((item, i) => (
        <li key={i}>
          <p>{item.title}</p>
          {makeHypertext(item.text)}
        </li>
      ))}
    </ul>
  </div>
);

export default LectureList;
