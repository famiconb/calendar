import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Props = {
  children: ReactNode;
  title?: string;
  goBack?: () => void;
};

const Layout = ({
  children,
  title = "This is the default title",
  goBack,
}: Props) => (
  <div className="bg-gray-100">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      {goBack && (
        <div className="p-2 flex bg-blue-200">
          <div>
            <button className="rounded-full text-xl w-8 h-8" onClick={goBack}>
              ←
            </button>
          </div>
          <p className="ml-4 p-1">{title}</p>
        </div>
      )}
    </header>
    <div className={goBack && "h-screen w-screen p-2.5"}>{children}</div>
  </div>
);

export default Layout;
