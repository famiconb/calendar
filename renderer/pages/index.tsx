import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";

// 表示用の講義データ
const lecture = {
  id: 0,
  name: "システム開発基礎",
  dates: [{ dayOfWeek: 2, period: [5, 6, 7, 8] }],
  memo: [{ title: "zoom", text: "https://A" }],
};

const IndexPage = () => {
  // イベントクリック 今は無用のもの
  // const onSelectEvent = useCallback((calEvent) => {
  //   window.alert(calEvent.title);
  // }, []);

  // 各表の行を表示する
  // number 何限目
  // lecture 講義データ Demo
  const row_view = (number: number, lecture: Lecture) => {
    // 時間割のnumber限目の列
    const row = [];

    // dayOfWeek 何曜日
    for (let dayOfWeek = 0; dayOfWeek < 6; dayOfWeek++) {
      if (dayOfWeek == 0) {
        row.push(<th style={{ border: "solid 1px" }}>{number + "時限目"}</th>);
      } else {
        let found = false;
        for (let i = 0; i < lecture.dates.length; ++i) {
          for (let j = 0; j < lecture.dates[i].period.length; ++j) {
            if (
              lecture.dates[i].period[j] == number &&
              lecture.dates[i].dayOfWeek == dayOfWeek
            ) {
              row.push(
                <th style={{ height: "50px", border: "solid 1px" }}>
                  <Link href="/lecture-info?id=1">{lecture.name}</Link>
                </th>
              );
              found = true;
            }
          }
        }
        if (!found)
          row.push(<th style={{ height: "50px", border: "solid 1px" }}></th>);
      }
    }
    return <tr>{row}</tr>;
  };

  return (
    <Layout title="CUCalendar">
      <Link href="counter">
        <a>Counter</a>
      </Link>
      <table style={{ border: "solid 1px" }}>
        <tr>
          <th style={{ width: "100px", border: "solid 1px" }}></th>
          <th style={{ width: "100px", border: "solid 1px" }}>月</th>
          <th style={{ width: "100px", border: "solid 1px" }}>火</th>
          <th style={{ width: "100px", border: "solid 1px" }}>水</th>
          <th style={{ width: "100px", border: "solid 1px" }}>木</th>
          <th style={{ width: "100px", border: "solid 1px" }}>金</th>
        </tr>
        {row_view(1, lecture)}
        {row_view(2, lecture)}
        {row_view(3, lecture)}
        {row_view(4, lecture)}
        {row_view(5, lecture)}
        {row_view(6, lecture)}
        {row_view(7, lecture)}
        {row_view(8, lecture)}
      </table>
    </Layout>
  );
};

export default IndexPage;
