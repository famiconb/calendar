import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { useQuarter } from "../hooks/useQuarter";


const GraduationPage = () => {

  const router = useRouter();
  const quarter: number = useQuarter();
  const lectures_allq: (Lecture[] | undefined)[] = []
  lectures_allq[0] = useLectureData(0).lectures;
  lectures_allq[1] = useLectureData(1).lectures;
  lectures_allq[2] = useLectureData(2).lectures;
  lectures_allq[3] = useLectureData(3).lectures;

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
    const class_codes = 'LAH.S433,LAH.T420,LAH.S501,LAC.M401,LAC.M527,CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478';

    global.ipcRenderer.send('check_graduation', [course, determine_course, class_codes])
  }
  const onClickFalse = () => {
    const course = '情報工学コース修士課程';
    const determine_course = '情報工学コース修士課程';
    const class_codes = 'CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478';

    global.ipcRenderer.send('check_graduation', [course, determine_course, class_codes])
  }

  return (lectures_allq[0] != null && lectures_allq[1] != null && lectures_allq[2] != null && lectures_allq[3] != null) ? (
    <Layout
      title="修了判定"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <button onClick={onClick}>[YES]</button>
      <button onClick={onClickFalse}>[NO]</button>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default GraduationPage;
