import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";
import Button from "../components/Button";

const EditPage = () => {
  const router = useRouter();

  const id = Number(router.query["id"]);
  const lecture = loadLecture().filter((lecture) => lecture.id == id)[0];

  const [dataLoaded, setDataLoaded] = useState(false);

  const [title, setTitle] = useState(lecture.name);
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };
  const [code, setCode] = useState(lecture.code);
  const handleCodeChange = (event: any) => {
    setCode(event.target.value);
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
      code: code,
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

    console.log(edited_lecture);

    const saved_lectures = loadLecture();
    const edited_lectures = saved_lectures.map((saved_lecture) => {
      if (saved_lecture.id != id) {
        return saved_lecture;
      } else {
        return edited_lecture;
      }
    });
    console.log(edited_lectures);
    saveLecture(edited_lectures);
    router.push("/");
  };

  const addInputForm = () => {
    console.log("addInputForm");
    setMemo((x) => [...x, { title: "", text: "" }]);
    console.log(memo);
  };

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return !dataLoaded ? (
    <div>loading...</div>
  ) : (
    <Layout title="授業情報の編集" goBack={() => router.push("/")}>
      <div className="edit-page_content m-auto w-11/12 mt-4">
        <div className="edit-page_inner m-2.5 block space-y-4">
          <div className="edit-page_row my-2.5 block">
            <p>授業名</p>
            <input
              name="title"
              className="border border-black rounded-sm w-full h-8 box-border p-1"
              value={title}
              onChange={handleTitleChange}
            ></input>
          </div>
          <div className="edit-page_row my-3 block">
            <p>科目コード</p>
            <input
              name="科目コード"
              className="border border-black rounded-sm w-full h-8 box-border p-1"
              value={code}
              onChange={handleCodeChange}
            ></input>
          </div>
          <div className="add-page_row my-2.5">
            <p>開講日時</p>
            <div className="space-x-5">
              {weekdays.map((w, i) => {
                return (
                  <span className="inline-block" key={`${w}-${i}`}>
                    <input
                      name="dow0"
                      type="checkbox"
                      value={`${i}`}
                      onChange={handleDowChange}
                      defaultChecked={dows.has(i)}
                    />{" "}
                    {w}
                  </span>
                );
              })}
            </div>
            <select name="begin" value={begin} onChange={handleBeginChange}>
              {[...Array(10).keys()].map((x) => (
                <option value={`${x + 1}`} key={`option-left-value-${x}`}>
                  {x + 1}限
                </option>
              ))}
            </select>
            〜
            <select name="end" value={end} onChange={handleEndChange}>
              {[...Array(10).keys()].map((x) => (
                <option value={`${x + 1}`} key={`option-right-value-${x}`}>
                  {x + 1}限
                </option>
              ))}
            </select>
          </div>
          <div className="add-page_row" style={{ margin: "10px 0px" }}>
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
              <a style={{ margin: "3px 0px" }} key={index}>
                <input
                  name="title"
                  className="border border-black rounded-sm p-1 w-full h-7 box-border"
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
                  className="border border-black w-full m-0 p-1 h-20 box-border"
                  placeholder="content"
                  defaultValue={memo[index].text}
                  onChange={handleMemoChange}
                  data-num={index}
                />
              </a>
            ))}
          </div>
          <Button onClick={onSubmit}>講義を編集</Button>
        </div>
      </div>
    </Layout>
  );
};

export default EditPage;
