import { useState } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";

const AddPage = () => {
  const router = useRouter();
  const errorMessages: string[] = [];

  const [title, setTitle] = useState("");
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };
  const [dows, _] = useState(new Set<number>());
  const handleDowChange = (event: any) => {
    if (dows.has(Number(event.target.value))) {
      dows.delete(Number(event.target.value));
    } else {
      dows.add(Number(event.target.value));
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
    if (event.target.name == "title") {
      memo[num].title = event.target.value;
    }
    if (event.target.name == "text") {
      memo[num].text = event.target.value;
    }
    console.log(memo);
  };

  const onSubmit = () => {
    console.log("onSubmit");
    const saved_lectures = loadLecture();
    const data: Lecture = {
      id:
        saved_lectures.length > 0
          ? saved_lectures[saved_lectures.length - 1].id + 1
          : 0,
      name: title,
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
      errorMessages.push("titleは必要です。");
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
          errorMessages.push("開講時間は必要です。");
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
                errorMessages.push("開講日時が既存の講義と重複しています。");
              }
            }
          }
        }
      }
    }

    if (passed) {
      console.log("passed");
      saveLecture([...saved_lectures, data]);
      router.push("/");
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
    <Layout title="授業情報の追加">
      <div className="content" style={{ margin: "10px" }}>
        <h1>授業情報の追加</h1>
        <div
          className="add-page_content"
          style={{ margin: "auto", width: "90%", border: "solid thin black" }}
        >
          <div
            className="add-page_inner"
            style={{ margin: "10px", display: "block" }}
          >
            <p
              className="add-page_row"
              style={{ margin: "10px 0px", display: "block" }}
            >
              授業名
              <br />
              <input
                name="title"
                style={{
                  width: "100%",
                  height: "2em",
                  boxSizing: "border-box",
                }}
                onChange={handleTitleChange}
              ></input>
            </p>
            <p className="add-page_row" style={{ margin: "10px 0px" }}>
              開講日時
              <br />
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="0"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onChange={handleDowChange}
                />{" "}
                日曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="1"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                月曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="2"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                火曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="3"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                水曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="4"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                木曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="5"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                金曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="6"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                />{" "}
                土曜日
              </span>
              <br />
              <select name="begin" onChange={handleBeginChange}>
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
              <select name="end" onChange={handleEndChange}>
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
            </p>
            <p className="add-page_row" style={{ margin: "10px 0px" }}>
              メモ
              <br />
              {memo.map((_, index) => (
                <a style={{ margin: "3px 0px" }} key={index}>
                  <input
                    name="title"
                    style={{
                      width: "100%",
                      height: "1.5em",
                      boxSizing: "border-box",
                    }}
                    placeholder="title"
                    onChange={handleMemoChange}
                    data-num={index}
                  ></input>
                  <textarea
                    name="memo-content"
                    style={{
                      width: "100%",
                      height: "5em",
                      boxSizing: "border-box",
                      margin: "0",
                    }}
                    placeholder="content"
                    onChange={handleMemoChange}
                    data-num={index}
                  />
                </a>
              ))}
              <button onClick={addInputForm}> 追加ボタン </button>
            </p>
            <button
              onClick={() => {
                router.push("/");
              }}
            >
              時間割に戻る
            </button>
            <button onClick={onSubmit}>講義を追加</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
