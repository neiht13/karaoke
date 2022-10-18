import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import karaoke from "./../../karaoke.json"
import {Button, Switch, Tabs} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const Record = (props) => (
    <tr>
        <td>{props.record.name}</td>
        <td>
            <table className="ant-table">
                <tbody className="ant-table-tbody">

                {props.record.scores.map(r => {
                    return (<tr>
                        <td>{r.gk}</td>
                        <td>{r.total}</td>
                        <td><DeleteOutlined style={{color: "tomato"}}
                                            onClick={() => {
                                                props.deleteRecord(props.record, r.gk);
                                            }}/></td>

                    </tr>)
                })}

                </tbody>
            </table>
        </td>
    </tr>
);

const User = (props) => (
    <tr>
        <td>{props.record.name}</td>
        <td>
            <Switch checked={props.record.status} onClick={()=>{props.handleStatus(props.record)}}/>
        </td>
    </tr>
);

export default function KaraokeDetail() {
    const [records, setRecords] = useState([]);
    const [deleteGK, setDeleteGK] = useState([]);
    const [users, setUsers] = useState([]);

    // This method fetches the records from the database.
    useEffect(() => {


        getUsers()
        getRecords();
        return;
    }, [records.length]);

    async function getUsers() {
        const response = await fetch(`https://karaserver.onrender.com/users`);
        const records = await response.json();
        setUsers(records);
    }
    async function getRecords() {
        const response = await fetch(`https://karaserver.onrender.com/karaoke`);

        if (!response.ok) {
            const message = `An error occured: ${response.statusText}`;
            window.alert(message);
            return;
        }

        const records = await response.json();
        // setRecords(karaoke.data);
        setRecords(records);
    }

    // This method will delete a record
    async function deleteRecord(record, gk) {
        const newRecords = record.scores && record.scores.filter((score) => score.gk !== gk);
        await fetch(`https://karaserver.onrender.com/karaoke/update/${record._id}`, {
            method: "POST",
            body: JSON.stringify({scores: [...newRecords, {gk: gk, scores1: 0, scores2: 0, scores3: 0, total: 0}]}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            getRecords()
        })
    }

        async function handleStatus(record) {
            await fetch(`https://karaserver.onrender.com/users/update/${record._id}`, {
                method: "POST",
                body: JSON.stringify({status: !record.status}),
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(() => {
                getUsers()
            })
        }


        // This method will map out the records on the table
        function recordList() {
            return records.map((record) => {
                return (
                    <Record
                        record={record}
                        deleteRecord={deleteRecord}
                        key={record._id}
                    />
                );
            });
        }

        function userList() {
            return users.map((record) => {
                return (
                    <User
                        record={record}
                        handleStatus={handleStatus}
                        key={record._id}
                    />
                );
            });
        }

        // This following section will display the table with the records of individuals.
        return (
            <div>
                <h3>Record List</h3>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Quản lý điểm" key="1">
                        <table className="ant-table ant-table-bordered" style={{marginTop: 20}}>
                            <thead className='ant-table-thead'>
                            <tr>
                                <th>Tên đơn vị</th>
                                <th>Điểm</th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">{recordList()}</tbody>
                        </table>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Quản lý đăng nhập" key="2">
                        <table className="ant-table ant-table-bordered" style={{marginTop: 20}}>
                            <thead className='ant-table-thead'>
                            <tr>
                                <th>Tên người dùng</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody className="ant-table-tbody">{userList()}</tbody>
                        </table>
                    </Tabs.TabPane>
                </Tabs>

            </div>
        );
    }
