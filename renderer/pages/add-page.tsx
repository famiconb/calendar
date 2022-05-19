import { useEffect, useState} from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const AddPage = () => {
  useEffect(() => {
    const handleMessage = (_event: any, args: any) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);

  const onAddLecure = () => {
    global.ipcRenderer.send("message", "追加しました");
  };

  return (
    <Layout title="授業情報の追加">
      <div className="content" style={{margin:'10px'}}>
        <h1>授業情報の追加</h1>
        <div className='add-page_content' style={{margin:"auto", width:'90%', border:"solid thin black"}}>
          <div className="add-page_inner" style={{margin:'10px', display:'block'}}>
            <p className="add-page_row" style={{margin:'10px 0px', display:'block'}}>
              授業名<br/><input name='name' style={{width:'100%', height:'2em', boxSizing:'border-box'}}></input>
            </p>
            <p className="add-page_row" style={{margin:'10px 0px'}}>
              開講日時<br/>
              <input type="radio" value='0' name="dow" style={{margin:'0px 0px 0px 10px'}}/> 日曜日
              <input type="radio" value='1' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 月曜日
              <input type="radio" value='2' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 火曜日
              <input type="radio" value='3' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 水曜日
              <input type="radio" value='4' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 木曜日
              <input type="radio" value='5' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 金曜日
              <input type="radio" value='6' name="dow" style={{margin:'0px 0px 0px 10px'}} /> 土曜日
              <br/>
              <select>
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
              <select>
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
              メモ<br/><textarea name='memo' style={{width:'100%', height:"5em", boxSizing:'border-box'}}/>
            </p>

            <Link href="/">
                <a>Go Home</a>
              </Link>
            <button>戻る</button>
            <input type="submit" value='追加'/>
            <button onClick={onAddLecure}>追加</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
