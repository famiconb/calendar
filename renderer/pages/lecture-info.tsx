import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";

type Props = {
  lecture: Lecture;
  lectureList: LectureMemo[];
};

const LectureInfoPage = ({ lecture = sampleLectureInfo }: Props) => (
  <Layout title="講義情報 | Next.js + TypeScript + Electron Example">
    <LectureList lecture={lecture} />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export const sampleLectureDates: LectureDate[] = [
  { dayOfWeek: 1, period: [1, 2] },
  { dayOfWeek: 4, period: [3, 5] },
];
export const sampleLectureMemo: LectureMemo[] = [
  { title: "title1", text: "text1 \n link" },
  { title: "title2", text: "text2 \n link" },
];
export const sampleLectureInfo: Lecture = {
  id: 1,
  name: "サンプル",
  dates: sampleLectureDates,
  memo: sampleLectureMemo,
};

export default LectureInfoPage;
