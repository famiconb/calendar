import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index";
import { loadLecture, saveLecture } from "../utils/lecture";
import { useRouter } from "next/router";
import { useQuarter } from "../hooks/useQuarter";
import Button from "../components/Button";
import PeriodSelector from "../components/PeriodSelector";
import DayOfWeeks from "../components/DayOfWeeks";
import { FaPlus } from "react-icons/fa";
import { BsCheckLg } from "react-icons/bs";

const EditPage = () => {
  const router = useRouter();
  const quarter: number = useQuarter();

  const id = Number(router.query["id"]);
  const [lecture] = useState(
    loadLecture(quarter).filter((lecture) => lecture.id == id)[0]
  );

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

  const [dows, setDows] = useState<number[]>([]);

  useEffect(() => {
    const dowSet = new Set<number>();
    lecture.dates.forEach((date) => {
      dowSet.add(date.dayOfWeek);
    });
    setDows(lecture.dates.map((x) => x.dayOfWeek));
    setDataLoaded(true);
  }, [lecture]);

  const [period, setPeriod] = useState<[number, number]>([
    lecture.dates[0].period[0],
    lecture.dates[0].period.slice(-1)[0],
  ]);

  const [memo, setMemo] = useState<LectureMemo[]>([]);

  useEffect(() => {
    lecture.memo.forEach((memo) => {
      setMemo((x) => [...x, { title: memo.title, text: memo.text }]);
    });
  }, [lecture]);

  const handleMemoChange = (event: any) => {
    const num = Number(event.target.dataset.num);
    if (event.target.name == "title") {
      memo[num].title = event.target.value;
    } else if (event.target.name == "text") {
      memo[num].text = event.target.value;
    }
    console.log(memo);
  };

  const onSubmit = () => {
    console.log("onSubmit");
    const errorMessages: string[] = [];
    const edited_lecture: Lecture = {
      id: id,
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
      edited_lecture.dates.push(date);
    }

    for (const memoi of memo) {
      if (memoi.title || memoi.text) {
        edited_lecture.memo.push(memoi);
      }
    }

    console.log(edited_lecture);

    const saved_lectures = loadLecture(quarter);
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
      errorMessages.push("???????????????????????????");
    }
    if (edited_lecture.dates.length == 0) {
      passed = false;
      errorMessages.push("??????????????????????????????");
    } else {
      for (const date of edited_lecture.dates) {
        if (date.dayOfWeek == null) {
          passed = false;
          errorMessages.push("??????????????????????????????");
        }
        if (date.period.length == 0) {
          passed = false;
          errorMessages.push(
            "????????????????????????????????????????????????????????????????????????"
          );
        }
        if (date.dayOfWeek == 7 && edited_lecture.dates.length > 1) {
          passed = false;
          errorMessages.push(
            "???????????????????????????????????????????????????????????????????????????"
          );
        }
      }
    }
    for (const memoi of edited_lecture.memo) {
      if (memoi.title == null || memoi.title == "") {
        passed = false;
        errorMessages.push("?????????title??????????????????");
      }
    }
    // ????????????????????????validate
    for (const saved_lecture of saved_lectures) {
      if (edited_lecture.id == saved_lecture.id) {
        continue;
      }
      let conflict_thislecture = false;
      for (const saved_lecture_date of saved_lecture.dates) {
        for (const saved_lecture_period of saved_lecture_date.period) {
          for (const date of edited_lecture.dates) {
            for (const period of date.period) {
              if (
                date.dayOfWeek !== 7 &&
                date.dayOfWeek == saved_lecture_date.dayOfWeek &&
                period == saved_lecture_period
              ) {
                passed = false;
                errorMessages.push(
                  "???????????????" + saved_lecture.name + "???????????????????????????"
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

    console.log(edited_lectures);
    if (passed) {
      console.log("passed");
      saveLecture(edited_lectures, quarter);
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

  return !dataLoaded ? (
    <div>loading...</div>
  ) : (
    <Layout
      title="?????????????????????"
      goBack={() =>
        router.push(
          `/lecture-info?id=${lecture.id}&quarter=${quarter.toString()}`
        )
      }
    >
      <div className="edit-page_content m-auto w-11/12 mt-4">
        <div className="edit-page_inner m-2.5 block space-y-4">
          <div className="edit-page_row my-2.5 block">
            <p className="text-sm">?????????</p>
            <input
              name="title"
              className="border-b border-black rounded-sm w-full h-8 box-border p-1"
              placeholder="?????????..."
              value={title}
              onChange={handleTitleChange}
            ></input>
          </div>
          <div className="edit-page_row my-3 block">
            <p className="text-sm">???????????????</p>
            <input
              name="???????????????"
              className="border-b border-black rounded-sm w-full h-8 box-border p-1"
              placeholder="CSC.T000"
              value={code}
              onChange={handleCodeChange}
            ></input>
          </div>
          <div className="add-page_row my-2.5">
            <p className="text-sm">????????????</p>
            <DayOfWeeks
              initialDayOfWeeks={dows}
              onDayOfWeeksChange={(x) => setDows(x)}
            />
            <PeriodSelector
              begin={period[0]}
              end={period[1]}
              onPeriodChange={(period) => setPeriod(period)}
            />
          </div>
          <div className="add-page_row" style={{ margin: "10px 0px" }}>
            <div className="flex p-1">
              <div className="flex-grow text-sm">??????</div>
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
              <a style={{ margin: "3px 0px" }} key={index}>
                <input
                  name="title"
                  className="border-b border-black border-dashed rounded-sm p-1 w-full h-7"
                  placeholder="????????????..."
                  defaultValue={memo[index].title}
                  onChange={handleMemoChange}
                  data-num={index}
                ></input>
                <textarea
                  name="text"
                  style={{
                    width: "100%",
                    height: "5em",
                    boxSizing: "border-box",
                    margin: "0",
                  }}
                  className="w-full m-0 p-1 h-20 box-border"
                  placeholder="???????????????..."
                  defaultValue={memo[index].text}
                  onChange={handleMemoChange}
                  data-num={index}
                />
              </a>
            ))}
          </div>
          <Button onClick={onSubmit} className="px-4 float-right text-white">
            ??????
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EditPage;
