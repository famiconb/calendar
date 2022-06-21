import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";
import { loadLecture } from "../utils/lecture";
import { useRouter } from "next/router";

const LectureInfoPage = () => {
  const router = useRouter();
  const query_id_raw = router.query["id"];

  if (query_id_raw === undefined) {
    return LectureInfoErrorPage("query is undefined");
  }
  try {
    const id = Array.isArray(query_id_raw) ? query_id_raw[0] : query_id_raw;
    const lecture = findLecture(id);
    return (
      <Layout title="講義情報 | Next.js + TypeScript + Electron Example">
        <LectureList lecture={lecture} />
        <p>
          <Link href="/">
            <a>Go home</a>
          </Link>
        </p>
      </Layout>
    );
  } catch (e: any) {
    return LectureInfoErrorPage("lecture is not found");
  }
};

const LectureInfoErrorPage = (err: string) => {
  return (
    <Layout title={`Error`}>
      <p>
        <span style={{ color: "red" }}>Error:</span> {err}
      </p>
    </Layout>
  );
};

function findLecture(id: number | string) {
  const lectures: Lecture[] = loadLecture();
  const found = lectures.find((lec) => lec.id === Number(id));

  if (!found) {
    throw new Error("Cannot find lecture");
  }

  return found;
}

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
