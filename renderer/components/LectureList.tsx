import Link from "next/link";
import React, { useMemo } from "react";
import ListItem from "./ListItem";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";

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

const LectureList = ({ lecture }: Props) => (
  <div className="m-2.5">
    <h2>講義名: {lecture.name}</h2>
    <Link href={`/edit-page?id=${lecture.id}`}>edit</Link>
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
          <textarea
            className="border border-black"
            value={item.text}
            contentEditable={false}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default LectureList;
