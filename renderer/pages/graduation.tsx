import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { useQuarter } from "../hooks/useQuarter";

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

interface Props {
  isOpen: boolean;
  text: string;
  onRequestClose(event: React.MouseEvent | React.KeyboardEvent): void;
}
const ResultModal = (props: Props) => {
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
  return (
    <Modal
      contentLabel="Check Modal"
      isOpen={props.isOpen}
      style={customStyles}
      onAfterOpen={() => {}}
      onRequestClose={props.onRequestClose}
    >
      <h2>{props.text}</h2>
      <div className="space-x-2 pt-2">
        {" "}
        <button
          onClick={props.onRequestClose}
          className="float-right border border-black rounded-sm"
        >
          閉じる
        </button>
      </div>
    </Modal>
  );
};

const course_list: string[] = [
  "情報工学コース修士課程",
  "情報工学コース博士後期課程",
  "エンジニアリングデザインコース修士課程",
  "サイバーセキュリティ特別専門学修プログラム",
  "データサイエンス・AI特別専門学修プログラム",
  "数学コース修士課程",
  "物理学コース修士課程",
  "化学コース修士課程",
  "地球惑星科学コース修士課程",
  "機械コース修士課程",
  "システム制御コース修士課程",
  "電気電子コース修士課程",
  "情報通信コース修士課程",
  "経営工学コース修士課程",
  "材料コース修士課程",
  "応用科学コース修士課程",
  "数理・計算科学コース修士課程",
  "生命理工学コース修士課程",
  "建築学コース修士課程",
  "土木工学コース修士",
  "地球環境共創コース修士課程",
  "社会・人間科学コース修士課程",
  "技術経営専門職学位課程",
  "エネルギーコース修士課程化学系所属",
  "エネルギーコース修士課程機械系所属",
  "エネルギーコース修士課程電気電子系所属",
  "エネルギーコース修士課程材料系所属",
  "エネルギーコース修士課程応用化学系所属",
  "エネルギーコース修士課程融合理工学系所属",
  "ライフエンジニアリングコース修士課程",
  "原子核工学コース修士課程",
  "知能情報コース修士課程",
  "都市・環境学コース修士課程",
  "数理ファイナンス特別専門学修プログラム",
  "Sustainable Engineering特別専門学修プログラム",
  "実践型アントレプレナー人材育成プログラム",
  "環境デザイン特別専門学修プログラム",
];

const CoursePulldown = (
  course_v: string,
  setCourse: (course: string) => void
) => {
  return (
    <select
      value={course_v}
      onChange={(event) => setCourse(event.target.value)}
    >
      {course_list.map((course: string, i: number) => {
        return (
          <option value={course} key={i}>
            {course}
          </option>
        );
      })}
    </select>
  );
};

const GraduationPage = () => {
  const router = useRouter();
  const quarter: number = useQuarter();
  const lectures0 = useLectureData(0).lectures;
  const lectures1 = useLectureData(1).lectures;
  const lectures2 = useLectureData(2).lectures;
  const lectures3 = useLectureData(3).lectures;
  const lectures4 = useLectureData(4).lectures;
  const lectures5 = useLectureData(5).lectures;
  const lectures6 = useLectureData(6).lectures;
  const lectures7 = useLectureData(7).lectures;
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

  const [course, setCourse] = useState<string>(course_list[0]);
  const [determine_course, setDetermineCourse] = useState<string>(
    course_list[0]
  );
  const [other_lecture, setOtherLecture] = useState<string>("");
  const onClick = () => {
    // const course = '情報工学コース修士課程';
    // const determine_course = '情報工学コース修士課程';
    // const class_codes = 'LAH.S433,LAH.T420,LAH.S501,LAC.M401,LAC.M527,CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478';
    if (
      lectures0 != null &&
      lectures1 != null &&
      lectures2 != null &&
      lectures3 != null &&
      lectures4 != null &&
      lectures5 != null &&
      lectures6 != null &&
      lectures7 != null
    ) {
      let class_codes = get_class_codes([
        lectures0,
        lectures1,
        lectures2,
        lectures3,
        lectures4,
        lectures5,
        lectures6,
        lectures7,
      ]);
      if (class_codes === "") {
        class_codes = other_lecture;
      } else if (other_lecture !== "") {
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
    lectures3 != null &&
    lectures4 != null &&
    lectures5 != null &&
    lectures6 != null &&
    lectures7 != null ? (
    <Layout
      title="修了判定"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <p>所属コース</p>
      {CoursePulldown(course, setCourse)}
      <p>修了判定コース</p>
      {CoursePulldown(determine_course, setDetermineCourse)}
      <p>その他履修済み講義コード</p>
      <input
        name="other_lecture"
        className="border border-black rounded-sm p-1 w-full h-7 box-border"
        placeholder="LAH.S433,LAH.T420"
        defaultValue=""
        onChange={(event) => {
          setOtherLecture(event.target.value);
        }}
      ></input>
      <Button color="primary" className="mx-2 mt-1.5" onClick={onClick}>
        修了判定を実行
      </Button>
      <ResultModal
        isOpen={modalOKIsOpen}
        onRequestClose={() => setOKIsOpen(false)}
        text="OK: 修了要件を満たしています"
      ></ResultModal>
      <ResultModal
        isOpen={modalNGIsOpen}
        onRequestClose={() => setNGIsOpen(false)}
        text="NG: 修了要件を満たしていません"
      ></ResultModal>
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
            {otherLecture([
              lectures0,
              lectures1,
              lectures2,
              lectures3,
              lectures4,
              lectures5,
              lectures6,
              lectures7,
            ])}
          </table>
        </div>
      </div>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default GraduationPage;
