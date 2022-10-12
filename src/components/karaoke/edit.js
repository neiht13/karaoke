import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {Button, Card, Rate} from "antd";
import {HeartFilled} from "@ant-design/icons";

export default function KaraokeEdit() {
    let gk = localStorage.getItem("bgk");
  const [total, setTotal] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [form, setForm] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
        const id = params.id.toString();
        const response = await fetch(`http://localhost:5000/karaoke/${params.id.toString()}`);

        if (!response.ok) {
            const message = `An error has occured: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const record = await response.json();
        if (!record) {
            window.alert(`Record with id ${id} not found`);
            navigate("/");
            return;
        }

        let s = record.scores;
        if (s && s.length > 0) {
            let s1 = s.filter(i => i.gk === gk);
            let s2 = s.filter(i => i.gk !== gk);
            setForm(s2)
            if (s1.length >0) {
                setScore1(s1[0].score1);
                setScore2(s1[0].score2);
                setScore3(s1[0].score3);
            }
        }
    }

        fetchData();

        return;

  }, [params.id, navigate]);


  async function onSubmit(e) {
    e.preventDefault();
    const scores = {
        gk,
        score1,
        score2,
        score3,
        total: score1+score2+score3
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/karaoke/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify({scores: [...form,scores]}),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(e=>{
        navigate("/karaoke")
    });
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
      <Card
            style={{
                textAlign: "center",
                marginBottom: "8px",
                borderRadius:"18px",
                boxShadow: "#0066aa80 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px"
            }}>
      <h4>Tổng điểm:&nbsp;{score1+score2+score3}</h4>
          <Button onClick={onSubmit}>Chấm Điểm</Button>
      <div style={{textAlign: "center"}}>
      <Rate allowHalf
            value={score1}
            character={<HeartFilled />}
            style={{
        fontSize: 60,
        color: "#0066aa"
      }}
      onChange={e=>{setScore1(e)}}
      />
        <h5>Giọng hát</h5><br/>

      </div>
      <div style={{textAlign: "center"}}>
      <Rate allowHalf
            value={score2}
            character={<HeartFilled />} count={2} style={{
        fontSize: 60,
        color: "#0066aa"
      }}
            onChange={e=>{setScore2(e)}}
      />
        <h5>Trang phục</h5><br/>

      </div>
      <div style={{textAlign: "center"}}>
      <Rate allowHalf
            value={score3}
            character={<HeartFilled />} count={3} style={{
        fontSize: 60,
        color: "#0066aa"
      }}
            onChange={e=>{setScore3(e)}}

      />
        <h5>Trình diễn</h5><br/>

      </div>
      </Card>
  );
}
