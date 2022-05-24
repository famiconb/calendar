import { useCallback, useMemo } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import jaJP from "date-fns/locale/ja";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  DateLocalizer,
} from "react-big-calendar";
import PropTypes from "prop-types";

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
    title: "システム開発基礎",
    allDay: false,
    start: new Date("2022-05-24 14:20"),
    end: new Date("2022-05-24 17:50"),
  },
];

const IndexPage = () => {
  // イベントクリック
  const onSelectEvent = useCallback((calEvent) => {
    window.alert(calEvent.title);
  }, []);

  const { messages, views } = useMemo(
    () => ({
      messages: {
        week: "週",
        day: "日",
        agenda: "詳細",
        previous: "先週",
        next: "来週",
        today: "今週",
      },
      views: {
        week: true,
        agenda: true,
      },
    }),
    []
  );

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
        style={{ height: 500 }}
        min={new Date("1997-01-01 8:00")}
        max={new Date("1997-01-01 21:00")}
        onSelectEvent={onSelectEvent}
        defaultView={Views.WEEK}
        views={views}
        messages={messages}
        step={15}
        timeslots={8}
      />
    </Layout>
  );
};

export default IndexPage;

IndexPage.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};
