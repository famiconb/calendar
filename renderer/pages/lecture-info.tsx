import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";
import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";

type Props = {
  lecture: Lecture;
  lectureList: LectureMemo[];
};

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

Modal.setAppElement("body");

const LectureInfoPage = ({ lecture = sampleLectureInfo }: Props) => {
  const router = useRouter();

  /* モーダルの設定 */
  let subtitle: HTMLHeadingElement | null;
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  /**
   * モーダルを開く
   */
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    if (subtitle) subtitle.style.color = "#f00";
  }

  /**
   * モーダルを閉じる
   */
  function closeModal() {
    setIsOpen(false);
  }

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
    router.push("/");
  };

  return (
    <Layout title="講義の詳細情報">
      <LectureList lecture={lecture} />
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
        <button onClick={openModal}>この講義を削除</button>
      </p>
      <Modal
        contentLabel="Example Modal"
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
};

// Modalのエラーが不明

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
