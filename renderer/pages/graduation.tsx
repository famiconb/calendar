import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture } from "../interfaces";
import { useLectureData } from "../hooks/useLectureData";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";


const GraduationPage = () => {

  // 表示用の講義データ
  const { lectures } = useLectureData(0);
  const router = useRouter();

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

  return lectures != null ? (
    <Layout title="CUCalendar">
      <button onClick={onClick}>[YES]</button>
      <button onClick={onClickFalse}>[NO]</button>
    </Layout>
  ) : (
    <div>loading...</div>
  );
};

export default GraduationPage;
