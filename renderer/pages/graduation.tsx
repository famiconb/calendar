import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { useQuarter } from "../hooks/useQuarter";

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

// 引数のlecture群から科目コードを抽出
const get_class_codes = (lectures_allq: Lecture[][]): string => {
  const codes: string[] = [];
  for (
    let index_lectures_allq = 0;
    index_lectures_allq < lectures_allq.length;
    index_lectures_allq++
  ) {
    const lectures = lectures_allq[index_lectures_allq];
    for (let index = 0; index < lectures.length; index++) {
      const lecture: Lecture = lectures[index];
      if (lecture.code != null && lecture.code !== "") {
        codes.push(lecture.code);
      }
    }
  }
  return codes.join(",");
};

/**
 * 科目コードが無い講義を取得
 * @param lectures
 * @returns
 */
const otherLecture = (lectures_allq: Lecture[][]) => {
  const others = [];
  for (
    let index_lectures_allq = 0;
    index_lectures_allq < lectures_allq.length;
    index_lectures_allq++
  ) {
    const lectures = lectures_allq[index_lectures_allq];
    for (let index = 0; index < lectures.length; index++) {
      const lecture: Lecture = lectures[index];
      if (!(lecture.code != null && lecture.code !== "")) {
        others.push(
          <tr className="text-center">
            <th> {index_lectures_allq + 1} </th>
            <th> {lecture.name} </th>
          </tr>
        );
      }
    }
  }
  if (others.length != 0) {
    return <tbody className="whitespace-normal p-1">{others}</tbody>;
  }
};

const GraduationPage = () => {
  const router = useRouter();
  const quarter: number = useQuarter();
  const lectures0 = useLectureData(0).lectures;
  const lectures1 = useLectureData(1).lectures;
  const lectures2 = useLectureData(2).lectures;
  const lectures3 = useLectureData(3).lectures;
  // const is_initialized_all = ():boolean => {
  //   return (lectures0 != null && lectures1 != null && lectures2 != null && lectures3 != null);
  // }

  /* モーダルの設定 */
  const [modalOKIsOpen, setOKIsOpen] = useState<boolean>(false);
  const [modalNGIsOpen, setNGIsOpen] = useState<boolean>(false);

  //pythonとの通信
  useEffect(() => {
    const handleMessage = (_event: any[], args: any[]) => {
      //console.log("from python:", args);
      if (args.length === 1 && args[0] == "True") {
        setOKIsOpen(true);
      } else {
        setNGIsOpen(true);
      }
    };

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("check_graduation", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("check_graduation", handleMessage);
    };
  }, []);

  const [course, setCourse] = useState<string>("");
  const [determine_course, setDetermineCourse] = useState<string>("");
  const [other_lecture, setOtherLecture] = useState<string>("");
  const onClick = () => {
    // const course = '情報工学コース修士課程';
    // const determine_course = '情報工学コース修士課程';
    // const class_codes = 'LAH.S433,LAH.T420,LAH.S501,LAC.M401,LAC.M527,CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478';
    if (
      lectures0 != null &&
      lectures1 != null &&
      lectures2 != null &&
      lectures3 != null
    ) {
      let class_codes = get_class_codes([
        lectures0,
        lectures1,
        lectures2,
        lectures3,
      ]);
      if (class_codes !== "") {
        class_codes = other_lecture;
      } else {
        class_codes = [class_codes, other_lecture].join(",");
      }
      global.ipcRenderer.send("check_graduation", [
        course,
        determine_course,
        class_codes,
      ]);
    }
  };

  return lectures0 != null &&
    lectures1 != null &&
    lectures2 != null &&
    lectures3 != null ? (
    <Layout
      title="修了判定"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <p>所属コース</p>
      <input
        name="course"
        className="border border-black rounded-sm p-1 w-full h-7 box-border"
        placeholder="title"
        defaultValue="情報工学コース修士課程"
        onChange={(event) => {
          setCourse(event.target.value);
        }}
      ></input>
      <p>修了判定コース</p>
      <input
        name="determine_course"
        className="border border-black rounded-sm p-1 w-full h-7 box-border"
        placeholder="title"
        defaultValue="情報工学コース修士課程"
        onChange={(event) => {
          setDetermineCourse(event.target.value);
        }}
      ></input>
      <p>その他履修済み講義コード(LAH.S433,LAH.T420,...)</p>
      <input
        name="other_lecture"
        className="border border-black rounded-sm p-1 w-full h-7 box-border"
        placeholder="title"
        defaultValue=""
        onChange={(event) => {
          setOtherLecture(event.target.value);
        }}
      ></input>
      <Button color="primary" className="mx-2 mt-1.5" onClick={onClick}>
        修了判定を実行
      </Button>
      <Modal
        contentLabel="Check Modal"
        isOpen={modalOKIsOpen}
        style={customStyles}
        onAfterOpen={() => {}}
        onRequestClose={() => setOKIsOpen(false)}
      >
        <h2>OK: 終了要件を満たしています</h2>
        <div className="space-x-2 pt-2">
          {" "}
          <button
            onClick={() => setNGIsOpen(false)}
            className="border border-black rounded-sm"
          >
            閉じる
          </button>
        </div>
      </Modal>
      <Modal
        contentLabel="Check Modal"
        isOpen={modalNGIsOpen}
        style={customStyles}
        onAfterOpen={() => {}}
        onRequestClose={() => setNGIsOpen(false)}
      >
        <h2>NG: 終了要件を満たしていません</h2>
        <div className="space-x-2 pt-2">
          {" "}
          <button
            onClick={() => setNGIsOpen(false)}
            className="border border-black rounded-sm"
          >
            閉じる
          </button>
        </div>
      </Modal>
      <div className="overflow-auto">
        <br></br>
        <h3>科目コードが無い講義</h3>
        <div className="border-double border-4 border-black flex-grow">
          <table className="w-full items-center cursor-pointer">
            <thead>
              <tr className="border-b border-black bg-gray-400">
                <th>クオーター</th>
                <th>講義名</th>
              </tr>
            </thead>
            {otherLecture([lectures0, lectures1, lectures2, lectures3])}
          </table>
        </div>
      </div>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default GraduationPage;
