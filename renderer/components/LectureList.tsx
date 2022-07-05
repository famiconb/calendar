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
      return "日曜日";
    case 1:
      return "月曜日";
    case 2:
      return "火曜日";
    case 3:
      return "水曜日";
    case 4:
      return "木曜日";
    case 5:
      return "金曜日";
    case 6:
      return "土曜日";
      case 7:
        return "その他";
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
          className="underline text-sky-700 font-light cursor-pointer"
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
          <p className="text-xl">{lecture.name}</p>
          <p className="text-xs">{lecture.code}</p>
          <p className="p-2"></p>
          <p className="text-sm">開講日時</p>
          <ul className="pl-2 border-4">
            {lecture.dates.map((item, i) => (
              <li key={i}>
                <div>
                  <p>
                    {getStringOfDayOfWeek(item)} の {getStringOfPeriod(item)} 時限
                  </p>
                  <p></p>
                </div>
              </li>
            ))}
          </ul>
          <p className="p-2"></p>
          <h3 className="text-sm">講義に関するメモ</h3>
          <ul className="pl-2 space-y-2 border-4">
            {lecture.memo.map((item, i) => (
              <li key={i}>
                <p className="font-bold">{item.title}</p>
                {makeHypertext(item.text)}
              </li>
            ))}
          </ul>
        </div>
);

export default LectureList;
