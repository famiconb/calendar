import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";

const EditPage = () => {
  const router = useRouter();
  const errorMessages: string[] = [];

  const id = Number(router.query["id"]);
  const lecture = loadLecture().filter((lecture) => lecture.id == id)[0];

  const [dataLoaded, setDataLoaded] = useState(false);

  const [title, setTitle] = useState(lecture.name);
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };

  const [dows, setDows] = useState(new Set<number>());
  useEffect(() => {
    lecture.dates.forEach((date) => {
      dows.add(date.dayOfWeek);
    });
    setDataLoaded(true);
  }, []);
  const handleDowChange = (event: any) => {
    if (dows.has(Number(event.target.value))) {
      dows.delete(Number(event.target.value));
    } else {
      dows.add(Number(event.target.value));
    }
    setDows(dows);
    console.log(dows);
  };

  const [begin, setBegin] = useState(lecture.dates[0].period[0]);
  const handleBeginChange = (event: any) => {
    setBegin(Number(event.target.value));
    console.log(begin);
  };

  const [end, setEnd] = useState(lecture.dates[0].period.slice(-1)[0]);
  const handleEndChange = (event: any) => {
    setEnd(Number(event.target.value));
    console.log(end);
  };

  const [memo, setMemo] = useState<LectureMemo[]>([]);
  useEffect(() => {
    lecture.memo.forEach((memo) => {
      setMemo((x) => [...x, { title: memo.title, text: memo.text }]);
    });
  }, []);
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
    const edited_lecture: Lecture = {
      id: id,
      name: title,
      dates: [],
      memo: memo,
    };
    for (const dow of dows) {
      const date: LectureDate = {
        dayOfWeek: dow,
        period: [],
      };
      for (let i = begin; i <= end; ++i) {
        date.period.push(i);
      }
      edited_lecture.dates.push(date);
    }

    for (const memoi of memo) {
      if (memoi.title || memoi.text) {
        edited_lecture.memo.push(memoi);
      }
    }

    console.log(edited_lecture);

    const saved_lectures = loadLecture();
    const edited_lectures = saved_lectures.map((saved_lecture) => {
      if (saved_lecture.id != id) {
        return saved_lecture;
      } else {
        return edited_lecture;
      }
    });

    let passed = true;
    if (edited_lecture.name == null || edited_lecture.name == "") {
      passed = false;
      errorMessages.push("titleは必要です。");
    }
    if (edited_lecture.dates.length == 0) {
      passed = false;
      errorMessages.push("開講日時は必要です。");
    } else {
      for (const date of edited_lecture.dates) {
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
    for (const memoi of edited_lecture.memo) {
      if (memoi.title == null || memoi.title == "") {
        passed = false;
        errorMessages.push("メモのtitleは必要です。");
      }
    }
    // 開講日時の重複をvalidate
    for (const date of edited_lecture.dates) {
      for (const period of date.period) {
        for (const saved_lecture of saved_lectures) {
          if (edited_lecture.id == saved_lecture.id) {
            continue;
          }
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

    console.log(edited_lectures);
    if (passed) {
      console.log("passed");
      saveLecture(edited_lectures);
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

  return !dataLoaded ? (
    <div>loading...</div>
  ) : (
    <Layout title="授業情報の編集">
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
                value={title}
                onChange={handleTitleChange}
              ></input>
            </p>
            <p className="add-page_row" style={{ margin: "10px 0px" }}>
              開講日時
              <br />
              <span style={{ display: "inline-block" }}>
                <input
                  name="dow0"
                  type="checkbox"
                  value="0"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onChange={handleDowChange}
                  defaultChecked={dows.has(0)}
                />{" "}
                日曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="1"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(1)}
                />{" "}
                月曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="2"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(2)}
                />{" "}
                火曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="3"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(3)}
                />{" "}
                水曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="4"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(4)}
                />{" "}
                木曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="5"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(5)}
                />{" "}
                金曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="6"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  defaultChecked={dows.has(6)}
                />{" "}
                土曜日
              </span>
              <br />
              <select name="begin" value={begin} onChange={handleBeginChange}>
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
              <select name="end" value={end} onChange={handleEndChange}>
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
                    defaultValue={memo[index].title}
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
                    defaultValue={memo[index].text}
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
            <button onClick={onSubmit}>講義を編集</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditPage;
