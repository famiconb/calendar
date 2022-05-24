import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{" "}
        |{" "}
        <Link href="/add-page">
          <a>講義追加</a>
        </Link>{" "}
        |{" "}
        <Link href="/lecture-info?id=1">
          <a>講義情報(DEBUG)</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>famiconb</span>
    </footer>
  </div>
);

export default Layout;
