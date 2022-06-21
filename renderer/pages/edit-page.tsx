import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";

type Props = {
  lecture: Lecture;
};

const EditPage = ({ lecture  = sampleLectureInfo}: Props) => {
  const router = useRouter();

  const [title, setTitle] = useState(lecture.name);
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };
  const [dows, setDows] = useState(new Set<number>());
  useEffect(() => {
    lecture.dates.forEach((date)=>{
      dows.add(date.dayOfWeek);
    });
    console.log(dows);
  }, []);
  const handleDowChange = (event: any) => {
    if (dows.has(Number(event.target.value))) {
      dows.delete(Number(event.target.value));
    } else {
      dows.add(Number(event.target.value));
    }
    console.log(dows);
  };

  const [begin, setBegin] = useState(lecture.dates[0].period[0]);
  const handleBeginChange = (event: any) => {
    setBegin(Number(event.target.value));
    console.log(begin);
  };

  const [end, setEnd] = useState(lecture.dates[0].period[1]);
  const handleEndChange = (event: any) => {
    setEnd(Number(event.target.value));
    console.log(end);
  };

  const [memo, setMemo] = useState<LectureMemo[]>([]);
  useEffect(() => {
    lecture.memo.forEach((memo)=>{
      setMemo((x) => [...x, { title: memo.title, text: memo.text }]);
    })
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
    const saved_lectures = loadLecture();
    const id = 0;
    const data: Lecture = {
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
      data.dates.push(date);
    }
    
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
    console.log(data);

    saved_lectures.filter(saved_lecture => saved_lecture.id != id);
    saveLecture([...saved_lectures, data]);
    router.push("/");
  };

  const addInputForm = () => {
    console.log("addInputForm");
    setMemo((x) => [...x, { title: "", text: "" }]);
    console.log(memo);
  };

  return (
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
                  type="checkbox"
                  value="0"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onChange={handleDowChange}
                  checked={dows.has(0)}
                />{" "}
                日曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="1"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(1)}
                />{" "}
                月曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="2"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(2)}
                />{" "}
                火曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="3"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(3)}
                />{" "}
                水曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="4"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(4)}
                />{" "}
                木曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="5"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(5)}
                />{" "}
                金曜日
              </span>
              <span style={{ display: "inline-block" }}>
                <input
                  type="checkbox"
                  value="6"
                  style={{ margin: "0px 0px 0px 10px" }}
                  onClick={handleDowChange}
                  checked={dows.has(6)}
                />{" "}
                土曜日
              </span>
              <br />
              <select name="begin"
              value={begin}
              onChange={handleBeginChange}>
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
              <select name="end"
              value={end}
              onChange={handleEndChange}>
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
                    value={memo[index].title}
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
                    value={memo[index].text}
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

const sampleLectureDates: LectureDate[] = [
  { dayOfWeek: 1, period: [1, 2] },
  { dayOfWeek: 4, period: [1, 2] },
];
const sampleLectureMemo: LectureMemo[] = [
  { title: "title1", text: "text1 \n link" },
  { title: "title2", text: "text2 \n link" },
];
const sampleLectureInfo: Lecture = {
  id: 1,
  name: "サンプル",
  dates: sampleLectureDates,
  memo: sampleLectureMemo,
};

export default EditPage;
