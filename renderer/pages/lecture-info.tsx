import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";

type Props = {
  lecture: Lecture;
  lectureList: LectureMemo[];
};

const LectureInfoPage = ({ lecture = sampleLectureInfo }: Props) => {

  let lecData;
  const deletePage  = () => {
    console.log("delete click");
    lecData = loadLecture();
    console.log(lecData);
  }

  return (
    <Layout title="講義の詳細情報">
      <LectureList lecture={lecture} />
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
        <button onClick={deletePage}>この講義を削除</button>
      </p>
    </Layout>
  );
};

const sampleLectureDates: LectureDate[] = [
  { dayOfWeek: 1, period: [1, 2] },
  { dayOfWeek: 4, period: [3, 5] },
];
const sampleLectureMemo: LectureMemo[] = [
  { title: "title1", text: "text1 \n link" },
  { title: "title2", text: "text2 \n link" },
];
const sampleLectureInfo: Lecture = {
  id: 1,
  name: "サンプル",
  dates: sampleLectureDates,
  memo: sampleLectureMemo,
};

export default LectureInfoPage;
