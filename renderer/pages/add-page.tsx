import { useState } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";

const AddPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };
  const dows = new Set<number>();
  const handleDowChange = (event: any) => {
    if (dows.has(Number(event.target.value))) {
      dows.delete(Number(event.target.value));
    } else {
      dows.add(Number(event.target.value));
    }
    console.log(dows);
  };

  const [begin, setBegin] = useState(0);
  const handleBeginChange = (event: any) => {
    setBegin(Number(event.target.value));
    console.log(begin);
  };

  const [end, setEnd] = useState(0);
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
    const data: Lecture = {
      id: 0,
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
    console.log(data);
    saveLecture([...loadLecture(), data]);
    router.push("/");
  };

  const addInputForm = () => {
    console.log("addInputForm");
    setMemo((x) => [...x, { title: "", text: "" }]);
    console.log(memo);
  };

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <Layout title="授業情報の追加" goBack={() => router.push("/")}>
      <div className="h-screen w-screen p-2.5">
        <div>
          <div className="add-page_content m-auto w-11/12 mt-4">
            <div className="add-page_inner m-2.5 block space-y-4">
              <p className="add-page_row my-2.5 block">
                授業名
                <br />
                <input
                  name="title"
                  className="border border-black rounded-sm w-full h-8 box-border"
                  onChange={handleTitleChange}
                ></input>
              </p>
              <p className="add-page_row my-2.5">
                開講曜日/時限
                <br />
                {weekdays.map((w, i) => (
                  <span className="inline-block" key={`${w}-${i}`}>
                    <input
                      type="checkbox"
                      value={i}
                      style={{ margin: "0px 0px 0px 10px" }}
                      onChange={handleDowChange}
                    />{" "}
                    {w}
                  </span>
                ))}
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
              </p>
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
                      placeholder="title"
                      onChange={handleMemoChange}
                      data-num={index}
                    ></input>
                    <textarea
                      name="memo-content"
                      className="border border-black w-full m-0 p-1 h-20 box-border"
                      placeholder="content"
                      onChange={handleMemoChange}
                      data-num={index}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-1">
                  <button
                    onClick={onSubmit}
                    className="p-1.5 rounded bg-blue-400 shadow-lg hover:bg-blue-300"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
