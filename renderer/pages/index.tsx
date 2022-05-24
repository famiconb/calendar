import { useCallback, useMemo } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

// 表示用の講義データ index.tsに少しだけ寄っている
const lecture = {
  id: 0,
  name: "システム開発基礎",
  dates: [5,8],
  weekday: 2,
  memo: "",
};

const IndexPage = () => {
  // イベントクリック 今は無用のもの
  // const onSelectEvent = useCallback((calEvent) => {
  //   window.alert(calEvent.title);
  // }, []);

  // 各表の行を表示する
  // number 何限目
  // lecture 講義データ Demo
  const row_view = (number, lecture) =>{
    const row=[];
    for (let i=0; i<6; i++){
      if(i==0){
        row.push(<th>{number + "時限目"}</th>)
      }else{
        if((lecture.dates[0] <= number && lecture.dates[1] >= number) && lecture.weekday == i){
          // TODO idをlecture.idにする
          row.push(<th height="50"><Link href="/lecture-info?id=1">{lecture.name}</Link></th>)
        }else{
          row.push(<th height="50"></th>)
        }
      }
    }
    return <tr>{row}</tr>;
  };

  return (
    <Layout title="CUCalendar">
      <Link href="counter">
        <a>Counter</a>
      </Link>
      <table border="4">
        <tr>
          <th width="100"></th>
          <th width="100">月</th>
          <th width="100">火</th>
          <th width="100">水</th>
          <th width="100">木</th>
          <th width="100">金</th>
        </tr>
          {row_view(1,lecture)}
          {row_view(2,lecture)}
          {row_view(3,lecture)}
          {row_view(4,lecture)}
          {row_view(5,lecture)}
          {row_view(6,lecture)}
          {row_view(7,lecture)}
          {row_view(8,lecture)}
      </table>
    </Layout>
  );
};

export default IndexPage;
