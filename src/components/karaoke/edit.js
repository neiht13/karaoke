import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router";
import {Button, Card, Rate, Tag} from "antd";
import {HeartFilled, LeftOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

export default function KaraokeEdit() {
    let gk = localStorage.getItem("bgk2");
    const [record, setRecord] = useState("");
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [score3, setScore3] = useState(0);
    const [form, setForm] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const id = params.id.toString();
            const response = await fetch(`https://karaserver.onrender.com/karaoke/${params.id.toString()}`);

            if (!response.ok) {
                const message = `An error has occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const record = await response.json();
            setRecord(record)
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
                if (s1.length > 0) {
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
            total: score1 + score2 + score3
        };

        // This will send a post request to update the data in the database.
        await fetch(`https://karaserver.onrender.com/karaoke/update/${params.id}`, {
            method: "POST",
            body: JSON.stringify({scores: [...form, scores]}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(e => {
            navigate("/karaoke")
        });
    }

    // This following section will display the form that takes input from the user to update the data.
    return (
        <>
            <Link to={"/karaoke"}>
                <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}><LeftOutlined
                    style={{color: "#0066aa"}}/><span>Quay lại</span></div>
            </Link>
            <Card
                style={{
                    textAlign: "center",
                    marginBottom: "8px",
                    borderRadius: "18px",
                    boxShadow: "#0066aa80 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px"
                }}>
                <h4><Tag style={{color: "#0066aa"}}>SBD: {record.sbd}</Tag>Tổng điểm&nbsp;<span
                    style={{fontSize: "2em", color: "#0066aa"}}>{score1 + score2 + score3}</span></h4>
                <div style={{textAlign: "center"}}>
                    <div><Button onClick={onSubmit}>Chấm Điểm</Button></div>

                    <Rate allowHalf
                          value={score1}
                          character={<HeartFilled/>}
                          style={{
                              fontSize: 55,
                              color: "#0066aa"
                          }}
                          onChange={e => {
                              setScore1(e)
                          }}
                    />
                    <h5>Giọng hát</h5><br/>

                </div>
                <div style={{textAlign: "center"}}>
                    <Rate allowHalf
                          value={score2}
                          character={<HeartFilled/>} count={2} style={{
                        fontSize: 55,
                        color: "#0066aa"
                    }}
                          onChange={e => {
                              setScore2(e)
                          }}
                    />
                    <h5>Trang phục</h5><br/>

                </div>
                <div style={{textAlign: "center"}}>
                    <Rate allowHalf
                          value={score3}
                          character={<HeartFilled/>} count={3} style={{
                        fontSize: 55,
                        color: "#0066aa"
                    }}
                          onChange={e => {
                              setScore3(e)
                          }}

                    />
                    <h5>Trình diễn</h5><br/>

                </div>
            </Card>
        </>
    );
}
