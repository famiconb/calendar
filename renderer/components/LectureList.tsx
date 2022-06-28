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

const LectureList = ({ lecture }: Props) => {
  const quarter: number = useQuarter();
  return (
    <ul>
      <h1>講義情報ページ</h1>
      <h2>講義名: {lecture.name}</h2>
      <h2>科目コード: {lecture.code}</h2>
      <Link href={`/edit-page?id=${lecture.id}&quarter=${quarter}`}>edit</Link>
      <h3>講義の日程</h3>
      {lecture.dates.map((item, i) => (
        <li key={i}>
          {getStringOfDayOfWeek(item)}
          曜日<br></br>
          時限:{getStringOfPeriod(item)}
        </li>
      ))}
      <h3>講義に関するメモ</h3>
      {lecture.memo.map((item, i) => (
        <li key={i}>
          {item.title}
          <br></br>
          <textarea value={item.text} contentEditable={false} />
        </li>
      ))}
    </ul>
  );
};

export default LectureList;
