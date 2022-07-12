import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { useQuarter } from "../hooks/useQuarter";
import { AiOutlineArrowLeft } from "react-icons/ai";

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
  <div className="bg-gray-100 w-screen h-screen">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      {goBack && (
        <div className="p-2 bg-blue-200">
          <div>
            <button
              className="rounded-full text-xl p-1 hover:bg-blue-300"
              onClick={goBack}
            >
              <AiOutlineArrowLeft />
            </button>
            <span className="ml-4 p-1 text-2xl">{title}</span>
          </div>
        </div>
      )}
    </header>
    <div className={goBack && "w-screen p-2.5"}>{children}</div>
  </div>
);

export default Layout;
