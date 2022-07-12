import { useState } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";
import { useQuarter } from "../hooks/useQuarter";
import Button from "../components/Button";
import PeriodSelector from "../components/PeriodSelector";
import DayOfWeeks from "../components/DayOfWeeks";
import { FaPlus } from "react-icons/fa";
import { GrTableAdd } from "react-icons/gr";

const AddPage = () => {
  const router = useRouter();

  // queryパラメータからquarterを取る
  const quarter: number = useQuarter();

  const [title, setTitle] = useState("");
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };

  const [code, setCode] = useState("");
  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
  };

  const [dows, setDows] = useState<number[]>([]);

  const [period, setPeriod] = useState<[number, number]>([1, 2]);

  const [memo, setMemo] = useState<LectureMemo[]>([{ title: "", text: "" }]);
  const handleMemoChange = (event: any) => {
    const num = Number(event.target.dataset.num);
    setMemo((m) =>
      m.map((x, n) => {
        if (n === num) {
          if (event.target.name === "text") {
            return { ...x, text: event.target.value };
          } else {
            return { ...x, title: event.target.value };
          }
        } else {
          return x;
        }
      })
    );

    console.log(memo);
  };

  const onSubmit = () => {
    console.log("onSubmit");
    const errorMessages: string[] = [];
    const saved_lectures = loadLecture(quarter);
    const data: Lecture = {
      id:
        saved_lectures.length > 0
          ? saved_lectures[saved_lectures.length - 1].id + 1
          : 0,
      name: title,
      code: code,
      dates: [],
      memo: [],
    };

    for (const dow of dows) {
      const date: LectureDate = {
        dayOfWeek: dow,
        period: [],
      };
      for (let i = period[0]; i <= period[1]; ++i) {
        date.period.push(i);
      }
      data.dates.push(date);
    }

    for (const memoi of memo) {
      if (memoi.title || memoi.text) {
        data.memo.push(memoi);
      }
    }

    console.log(data);

    let passed = true;
    if (data.name == null || data.name == "") {
      passed = false;
      errorMessages.push("授業名は必要です。");
    }
    if (data.dates.length == 0) {
      passed = false;
      errorMessages.push("開講日時は必要です。");
    } else {
      for (const date of data.dates) {
        if (date.dayOfWeek == null) {
          passed = false;
          errorMessages.push("開講曜日は必要です。");
        }
        if (date.period.length == 0) {
          passed = false;
          errorMessages.push(
            "講義開始時限は終了時限以前である必要があります。"
          );
        }
        if (date.dayOfWeek == 7 && data.dates.length > 1) {
          passed = false;
          errorMessages.push(
            "開講曜日では、その他と曜日を同時に選択できません。"
          );
        }
      }
    }
    for (const memoi of data.memo) {
      if (memoi.title == null || memoi.title == "") {
        passed = false;
        errorMessages.push("メモのtitleは必要です。");
      }
    }
    // 開講日時の重複をvalidate
    for (const saved_lecture of saved_lectures) {
      let conflict_thislecture = false;
      for (const saved_lecture_date of saved_lecture.dates) {
        for (const saved_lecture_period of saved_lecture_date.period) {
          for (const date of data.dates) {
            for (const period of date.period) {
              if (
                date.dayOfWeek !== 7 &&
                date.dayOfWeek === saved_lecture_date.dayOfWeek &&
                period === saved_lecture_period
              ) {
                passed = false;
                errorMessages.push(
                  "開講日時が" + saved_lecture.name + "と重複しています。"
                );
                conflict_thislecture = true;
                break;
              }
            }
            if (conflict_thislecture) {
              break;
            }
          }
          if (conflict_thislecture) {
            break;
          }
        }
        if (conflict_thislecture) {
          break;
        }
      }
    }

    if (passed) {
      console.log("passed");
      saveLecture([...saved_lectures, data], quarter);
      router.push("/?quarter=" + quarter.toString());
    } else {
      console.log("failed");
      console.log(errorMessages);
      window.alert(errorMessages);
    }
  };

  const addInputForm = () => {
    console.log("addInputForm");
    setMemo((x) => [...x, { title: "", text: "" }]);
    console.log(memo);
  };

  return (
    <Layout
      title="講義情報の追加"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <div className="add-page_content m-auto w-11/12 mt-4">
        <div className="add-page_inner m-2.5 block space-y-4">
          <div className="add-page_row my-2.5 block">
            <p className="text-sm">講義名</p>
            <input
              name="title"
              className="border-b border-black rounded-sm w-full h-8 box-border p-1"
              placeholder="講義名..."
              onChange={handleTitleChange}
            ></input>
          </div>
          <div className="add-page_row my-3 block">
            <p className="text-sm">科目コード</p>
            <input
              name="科目コード"
              className="border-b border-black rounded-sm w-full h-8 box-border p-1"
              placeholder="CSC.T000"
              onChange={handleCodeChange}
            ></input>
          </div>
          <div className="add-page_row my-2.5">
            <p className="text-sm">開講曜日/時限</p>
            <DayOfWeeks onDayOfWeeksChange={(x) => setDows(x)} />

            <PeriodSelector
              begin={period[0]}
              end={period[1]}
              onPeriodChange={(period) => setPeriod(period)}
            />
          </div>
          <div className="add-page_row space-y-1 my-2.5">
            <div className="flex">
              <p className="flex-grow text-sm">メモ</p>
              <Button
                onClick={addInputForm}
                className="bg-blue-400 hover:bg-blue-300 shadow-md px-4"
              >
                <div className="text-white">
                  <FaPlus />
                </div>
              </Button>
            </div>
            {memo.map((_, index) => (
              <div style={{ margin: "3px 0px" }} key={`memo-${index}`}>
                <input
                  name="title"
                  className="border-b border-dashed border-black rounded-sm p-1 w-full h-7 box-border"
                  placeholder="メモタイトル..."
                  onChange={handleMemoChange}
                  data-num={index}
                ></input>
                <textarea
                  name="text"
                  className="w-full m-0 p-1 h-20 box-border"
                  placeholder="コンテンツ..."
                  onChange={handleMemoChange}
                  data-num={index}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="space-x-1">
              <Button
                onClick={onSubmit}
                className="px-4  float-right text-white"
              >
                追加
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
