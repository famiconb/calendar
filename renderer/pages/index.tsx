import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import jaJP from "date-fns/locale/ja";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";

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

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event: any, args: any) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send("message", "hi from next");
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <Link href="/add-page">
                 <a>Go Home</a>
               </Link>
      <BigCalendar localizer={localizer} />
    </Layout>
  );
};

export default IndexPage;
