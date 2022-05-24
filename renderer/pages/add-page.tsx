import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory, BrowserRouter, useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import Link from "next/link";
import Layout from "../components/Layout";
import { Lecture, LectureDate, LectureMemo } from "../interfaces/index"
import { saveLecture } from "../utils/lecture";

const AddPage = () => {

  const history = useHistory();
  const data = {} as Lecture;
  const [title, setTitle] = useState('');
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    console.log(title);
  };
  const [dows,setDow] = useState(new Set());
  const handleDowChange = (event: any) => {
    if (dows.has(event.target.name)) {
      dows.delete(event.target.name);
    } else {
      dows.add(event.target.name);
    }
    console.log(dows)
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

  const [memo, setMemo] = useState([] as LectureMemo[]);
  memo.push({} as LectureMemo);
  const handleMemoChange = (event: any) => {
    const num = Number(event.target.dataset.num);
    if (event.target.name == "title") {
      memo[num].title = event.target.value;
    }
    if (event.target.name == "text") {
      memo[num].text = event.target.value;
    }
    console.log(memo);
  }

  useEffect(() => {
    const handleMessage = (_event: any, args: any) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);

  const {
    handleSubmit,
    control, // 追加
  } = useForm<LectureMemo>();

  const onSubmit = () => {
    data.name = title;
    data.dates = [] as LectureDate[];
    for (const dow of dows) {
      const date = {} as LectureDate;
      date.dayOfWeek = dow;
      date.period = [begin, end];
      data.dates.push(date);
    }
    data.memo = memo;
    console.log(data);
    saveLecture([data]);
  };

  // 追加
  const { fields, append } = useFieldArray({
    control,
    name: "memoForm",
  })

  const addInputForm = () => {
    append({} as LectureMemo);
  }

  const onAddLecure = () => {
    global.ipcRenderer.send("message", "追加しました");
  };

  return (
    <Layout title="授業情報の追加">
      <div className="content" style={{margin:'10px'}}>
        <h1>授業情報の追加</h1>
        <div className='add-page_content' style={{margin:"auto", width:'90%', border:"solid thin black"}}>
          <div className="add-page_inner" style={{margin:'10px', display:'block'}}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="add-page_row" style={{margin:'10px 0px', display:'block'}}>
                授業名<br/>
                <input name='title' style={{width:'100%', height:'2em', boxSizing:'border-box'}} onChange={handleTitleChange}></input>
              </p>
              <p className="add-page_row" style={{margin:'10px 0px'}}>
                開講日時<br/>
                <span style={{display:'inline-block'}}><input type="checkbox" name="dow-0" style={{margin:'0px 0px 0px 10px'}} onChange={handleDowChange}/> 日曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='1' name="dow-1" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 月曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='2' name="dow-2" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 火曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='3' name="dow-3" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 水曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='4' name="dow-4" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 木曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='5' name="dow-5" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 金曜日</span>
                <span style={{display:'inline-block'}}><input type="checkbox" value='6' name="dow-6" style={{margin:'0px 0px 0px 10px'}} onClick={handleDowChange}/> 土曜日</span>
                <br/>
                <select name="begin" onChange={handleBeginChange}>
                  <option value='1'>1限</option>
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
                  <option value='1'>1限</option>
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
              <p className="add-page_row" style={{margin:'10px 0px'}}>
                メモ<br/>
                <input name='title' style={{width:'100%', height:'1.5em', boxSizing:'border-box'}} placeholder='title' onChange={handleMemoChange} data-num={0}></input><br/>
                <textarea name='memo-content' style={{width:'100%', height:"5em", boxSizing:'border-box', margin:'0'}} placeholder='content' onChange={handleMemoChange} data-num={0}/>

                  {fields.map((field, index) => (
                    <a style={{margin:'3px 0px'}} key={field.id}>
                      <input name='title' style={{width:'100%', height:'1.5em', boxSizing:'border-box'}} placeholder='title' onChange={handleMemoChange} data-num={index+1}></input>
                      <textarea name='memo-content' style={{width:'100%', height:"5em", boxSizing:'border-box', margin:'0'}} placeholder='content' onChange={handleMemoChange} data-num={index+1}/>
                    </a>
                  ))}
              </p>
              <button onClick={addInputForm}> 追加ボタン </button><br/>
              <Link href="/">
                  <a>Go Home</a>
                </Link>
              <input type="submit"/>
            </form>

            <button onClick={()=> {history.push('/');}}>aaa</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
