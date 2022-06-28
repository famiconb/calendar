import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { useQuarter } from "../hooks/useQuarter";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";
import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const LectureInfoPage = () => {
  const router = useRouter();
  const quarter = useQuarter();
  const query_id_raw = router.query["id"];

  /* モーダルの設定 */
  let subtitle: HTMLHeadingElement | null;
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  /**
   * モーダルを開く
   */
  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {
    if (subtitle) subtitle.style.color = "#f00";
  };

  /**
   * モーダルを閉じる
   */
  const closeModal = () => {
    setIsOpen(false);
  };

  if (query_id_raw === undefined) {
    return LectureInfoErrorPage("query is undefined");
  }
  try {
    const id = Array.isArray(query_id_raw) ? query_id_raw[0] : query_id_raw;
    const lecture = findLecture(id);
    /**
     * 開かれているページ(lectureのidと一致するもの)の講義情報を削除する
     */
    const deletePage = () => {
      console.log("delete click");
      const lecData = loadLecture();
      console.log(lecData);
      for (let i = 0; i < lecData.length; i++) {
        // 保存済講義に同じidの講義を見つけたら削除
        if (lecData[i].id == lecture.id) {
          console.log("deleted!" + lecData[i].name);
          lecData.splice(i, 1);
          break;
        }
      }
      //lecDataの上書き
      saveLecture(lecData);
      console.log(loadLecture());
      router.push("/?quarter=" + quarter.toString());
    };

    return (
      <Layout title="講義の詳細情報">
        <LectureList lecture={lecture} />
        <p>
          <Link href={`/?quarter=${quarter}`}>
            <a>Go home</a>
          </Link>
          <button onClick={openModal}>この講義を削除</button>
        </p>
        <Modal
          contentLabel="Check Modal"
          isOpen={modalIsOpen}
          style={customStyles}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
            「{lecture.name}」を消して大丈夫ですか？
          </h2>
          <button onClick={closeModal}>やっぱやめる</button>
          <button onClick={deletePage}>消します!</button>
        </Modal>
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
