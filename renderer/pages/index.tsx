import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";

const IndexPage = () => {

  // 表示用の講義データ
  const { lectures } = useLectureData();

  const lecture_time = (number: number) => {
    const times = ["", "8:50-9:40", "9:40-10:30", "10:45-11:35", "11:35-12:25" , "14:20-15:10", "15:10-16:00", "16:15-17:05", "17:05-17:55"];
    // const times = ["", "8:50~", "~10:30", "10:45~", "~12:25" , "14:20~", "~16:00", "16:15~", "~17:55"];
    return times[number]
  } ;

  /**
   * 各表の行を表示する
   * @param number 何限目
   * @param lectures 講義データ
   * @returns number限目の行row
   */
  const row_view = (number: number, lectures: Lecture[]) => {
    // 時間割のnumber限目の列
    const row = [];

    // dayOfWeek 何曜日
    for (let dayOfWeek = 0; dayOfWeek < 6; dayOfWeek++) {
      if (dayOfWeek == 0) {
        row.push(<th style={{ border: "solid 1px" }}>{number + "時限目" + lecture_time(number)}</th>);
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

  return lectures != null ? (
    <Layout title="CUCalendar">
      <table style={{ border: "solid 1px" }}>
        <tr>
          <th style={{ width: "80px", border: "solid 1px" }}></th>
          <th style={{ width: "100px", border: "solid 1px" }}>月</th>
          <th style={{ width: "100px", border: "solid 1px" }}>火</th>
          <th style={{ width: "100px", border: "solid 1px" }}>水</th>
          <th style={{ width: "100px", border: "solid 1px" }}>木</th>
          <th style={{ width: "100px", border: "solid 1px" }}>金</th>
        </tr>
        {row_view(1, lectures)}
        {row_view(2, lectures)}
        {row_view(3, lectures)}
        {row_view(4, lectures)}
        {row_view(5, lectures)}
        {row_view(6, lectures)}
        {row_view(7, lectures)}
        {row_view(8, lectures)}
      </table>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default IndexPage;
