import Link from "next/link";
import Layout from "../components/Layout";
import LectureList from "../components/LectureList";
import { useQuarter } from "../hooks/useQuarter";
import { Lecture, LectureDate, LectureMemo, User } from "../interfaces";
import { loadLecture, saveLecture } from "../utils/lecture";
import React, { useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { BsFillTrashFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

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
    const lecture = findLecture(id, quarter);
    /**
     * 開かれているページ(lectureのidと一致するもの)の講義情報を削除する
     */
    const deletePage = () => {
      console.log("delete click");
      const lecData = loadLecture(quarter);
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
      saveLecture(lecData, quarter);
      console.log(loadLecture(quarter));
      router.push("/?quarter=" + quarter.toString());
    };

    return (
      <Layout
        title="講義の詳細情報"
        goBack={() => router.push("/?quarter=" + quarter.toString())}
      >
        <div className="m-auto w-11/12 mt-4">
          <div className="m-2.5 block space-y-4">
            <div className="my-2.5 block"></div>
            <LectureList lecture={lecture} />
            <div className="float-right">
              <Button
                color="primary"
                className="mx-2 mt-1.5 text-white px-4"
                onClick={() =>
                  router.push(
                    "/edit-page?id=" +
                      lecture.id.toString() +
                      "&quarter=" +
                      quarter.toString()
                  )
                }
              >
                <BiEdit />
              </Button>
              <Button
                onClick={openModal}
                color="red"
                className="text-white px-4"
              >
                <BsFillTrashFill />
              </Button>
            </div>
            <Modal
              contentLabel="Check Modal"
              isOpen={modalIsOpen}
              style={customStyles}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
            >
              <h2
                ref={(_subtitle) => (subtitle = _subtitle)}
                className="text-lg"
              >
                「{lecture.name}」を消して大丈夫ですか？
              </h2>
              <div className="space-x-2 pt-2 flex justify-center">
                <Button
                  onClick={deletePage}
                  color="red"
                  className="rounded-sm text-white px-4"
                >
                  ○
                </Button>
                <Button
                  onClick={closeModal}
                  className="rounded-sm text-white px-4"
                >
                  ×
                </Button>
              </div>
            </Modal>
          </div>
        </div>
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

function findLecture(id: number | string, quarter: number) {
  const lectures: Lecture[] = loadLecture(quarter);
  const found = lectures.find((lec) => lec.id === Number(id));

  if (!found) {
    throw new Error("Cannot find lecture");
  }

  return found;
}

export default LectureInfoPage;
