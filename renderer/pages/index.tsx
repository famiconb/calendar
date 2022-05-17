import {useCallback} from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import jaJP from "date-fns/locale/ja";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";

// BigCalendarの日付を日本時刻に
const locales = {
  "ja-JP": jaJP,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 時間割表示用イベント
const eventList = [
  {
    id: 0,
    title: 'システム開発基礎',
    allDay: false,
    start: new Date('2022-05-17 14:20'),
    end: new Date('2022-05-17 17:50'),
  }
];


const IndexPage = () => {

  // イベントクリック
  const onSelectEvent = useCallback((calEvent) => {
    window.alert(calEvent.title)
  }, []) 

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <Link href="counter">
        <a>Counter</a>
      </Link>
      <BigCalendar 
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        style={{height:500}}
        min = {new Date('1997-01-01 8:00')}
        max = {new Date('1997-01-01 21:00')}
        onSelectEvent={onSelectEvent}
      />
    </Layout>
  );
};

export default IndexPage;
