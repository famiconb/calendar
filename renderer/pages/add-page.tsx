import { useState } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";
import { useQuarter } from "../hooks/useQuarter";
import Button from "../components/Button";

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
  const [dows, _] = useState(new Set<number>());
  const handleDowChange = (event: any) => {
    const value = Number(event.target.value);
    if (dows.has(value)) {
      dows.delete(value);
    } else {
      dows.add(value);
    }
    console.log(dows);
  };

  const [begin, setBegin] = useState(1);
  const handleBeginChange = (event: any) => {
    setBegin(Number(event.target.value));
    console.log(begin);
  };

  const [end, setEnd] = useState(1);
  const handleEndChange = (event: any) => {
    setEnd(Number(event.target.value));
    console.log(end);
  };

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
      for (let i = begin; i <= end; ++i) {
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
            "開講曜日ではその他と曜日を同時に選択できません。"
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
    for (const date of data.dates) {
      for (const period of date.period) {
        for (const saved_lecture of saved_lectures) {
          for (const saved_lecture_date of saved_lecture.dates) {
            for (const saved_lecture_period of saved_lecture_date.period) {
              if (
                date.dayOfWeek == saved_lecture_date.dayOfWeek &&
                period == saved_lecture_period
              ) {
                passed = false;
                errorMessages.push(
                  "開講日時が" + saved_lecture.name + "と重複しています。"
                );
              }
            }
          }
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

  const weekdays = ["日", "月", "火", "水", "木", "金", "土", "その他"];

  return (
    <Layout
      title="授業情報の追加"
      goBack={() => router.push("/?quarter=" + quarter.toString())}
    >
      <div className="add-page_content m-auto w-11/12 mt-4">
        <div className="add-page_inner m-2.5 block space-y-4">
          <div className="add-page_row my-2.5 block">
            <p>授業名</p>
            <input
              name="title"
              className="border border-black rounded-sm w-full h-8 box-border p-1"
              placeholder="授業名..."
              onChange={handleTitleChange}
            ></input>
          </div>
          <div className="add-page_row my-3 block">
            <p>科目コード</p>
            <input
              name="科目コード"
              className="border border-black rounded-sm w-full h-8 box-border p-1"
              onChange={handleCodeChange}
            ></input>
          </div>
          <div className="add-page_row my-2.5">
            <p>開講曜日/時限</p>
            <div className="space-x-5">
              {weekdays.map((w, i) => (
                <span className="inline-block" key={`${w}-${i}`}>
                  <input type="checkbox" value={i} onChange={handleDowChange} />{" "}
                  {w}
                </span>
              ))}
            </div>
            <select
              name="begin"
              className="border rounded-sm border-black ml-4"
              onChange={handleBeginChange}
            >
              <option value="1">1限</option>
              <option value="2">2限</option>
              <option value="3">3限</option>
              <option value="4">4限</option>
              <option value="5">5限</option>
              <option value="6">6限</option>
              <option value="7">7限</option>
              <option value="8">8限</option>
              <option value="9">9限</option>
              <option value="10">10限</option>
            </select>
            〜
            <select
              name="end"
              className="border rounded-sm border-black"
              onChange={handleEndChange}
            >
              <option value="1">1限</option>
              <option value="2">2限</option>
              <option value="3">3限</option>
              <option value="4">4限</option>
              <option value="5">5限</option>
              <option value="6">6限</option>
              <option value="7">7限</option>
              <option value="8">8限</option>
              <option value="9">9限</option>
              <option value="10">10限</option>
            </select>
          </div>
          <div className="add-page_row space-y-1 my-2.5">
            <div className="flex">
              <p className="flex-grow">メモ</p>
              <button
                onClick={addInputForm}
                className="bg-blue-400 hover:bg-blue-300 shadow-md rounded-full h-7 w-7"
              >
                +
              </button>
            </div>
            {memo.map((_, index) => (
              <div style={{ margin: "3px 0px" }} key={`memo-${index}`}>
                <input
                  name="title"
                  className="border border-black rounded-sm p-1 w-full h-7 box-border"
                  placeholder="メモタイトル..."
                  onChange={handleMemoChange}
                  data-num={index}
                ></input>
                <textarea
                  name="text"
                  className="border border-black w-full m-0 p-1 h-20 box-border"
                  placeholder="コンテンツ..."
                  onChange={handleMemoChange}
                  data-num={index}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-1">
              <Button onClick={onSubmit}>追加</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
