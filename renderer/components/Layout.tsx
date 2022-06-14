import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuarter } from "../hooks/useQuarter";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  // queryパラメータからquarterを取る
  const quarter: number = useQuarter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href={`/?quarter=${quarter}`}>
            <a>Home</a>
          </Link>{" "}
          |{" "}
          <Link href={`/add-page?quarter=${quarter}`}>
            <a>講義追加</a>
          </Link>
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        {/* ここがフッター */}
        <span></span>
      </footer>
    </div>
  );
};

export default Layout;
