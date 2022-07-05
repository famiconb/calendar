import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { useQuarter } from "../hooks/useQuarter";


// 引数のlecture群から科目コードを抽出
const get_class_codes = (lectures_allq: Lecture[][]):string => {
  const codes: string[] = []
  for (let index_lectures_allq = 0; index_lectures_allq < lectures_allq.length; index_lectures_allq++) {
    const lectures = lectures_allq[index_lectures_allq];
    for (let index = 0; index < lectures.length; index++) {
      const lecture: Lecture = lectures[index];
      if (lecture.code != null && lecture.code !== "") {
        codes.push(lecture.code);
      }
    }
  }
  return codes.join(",")
}


/**
 * 科目コードが無い講義を取得
 * @param lectures
 * @returns
 */
 const otherLecture = (lectures_allq: Lecture[][]) => {
  const others = [];
  for (let index_lectures_allq = 0; index_lectures_allq < lectures_allq.length; index_lectures_allq++) {
    const lectures = lectures_allq[index_lectures_allq];
    for (let index = 0; index < lectures.length; index++) {
      const lecture: Lecture = lectures[index];
      if (!(lecture.code != null && lecture.code !== "")) {
        others.push(
          <tr className="text-center">
            <th> {index_lectures_allq+1} </th>
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

  //pythonとの通信
  useEffect(() => {
    const handleMessage = (_event: any[], args: any[]) => {
      console.log("from python:", args);
    }
  
    // add a listener to 'message' channel
    global.ipcRenderer.addListener('check_graduation', handleMessage)
  
    return () => {
      global.ipcRenderer.removeListener('check_graduation', handleMessage)
    }
  }, [])
  
  const onClick = () => {
    const course = '情報工学コース修士課程';
    const determine_course = '情報工学コース修士課程';
    //const class_codes = 'LAH.S433,LAH.T420,LAH.S501,LAC.M401,LAC.M527,CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478';
    if (lectures0 != null && lectures1 != null && lectures2 != null && lectures3 != null) {
      const class_codes = get_class_codes( [lectures0, lectures1, lectures2, lectures3]);
      global.ipcRenderer.send('check_graduation', [course, determine_course, class_codes]);
    }
  }

  return (lectures0 != null && lectures1 != null && lectures2 != null && lectures3 != null) ? (
    <Layout
      title="修了判定"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <button onClick={onClick}>[YES]</button>
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
