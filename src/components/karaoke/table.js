import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import karaoke from "./../../karaoke.json"

const Record = (props) => (
    <tr>
        <td>{props.record.name}</td>
        <td>
            <table className="ant-table">
                <tbody className="ant-table-tbody">

                    {props.record.scores.map(r=>{
                        return(<tr>
                        <td>{r.gk}</td>
                        <td>{r.total}</td></tr>)
                    })}

                </tbody>
            </table>
        </td>
        <td>
            {/*<Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |*/}
            <button className="btn btn-link"
                    onClick={() => {
                        props.deleteRecord(props.record._id);
                    }}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default function KaraokeDetail() {
    const [records, setRecords] = useState([]);

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/karaoke/`);

            if (!response.ok) {
              const message = `An error occured: ${response.statusText}`;
              window.alert(message);
              return;
            }

            const records = await response.json();
            // setRecords(karaoke.data);
            setRecords(records);
        }

        getRecords();

        return;
    }, [records.length]);

    // This method will delete a record
    async function deleteRecord(id) {
        await fetch(`http://localhost:5000/karaoke/${id}`, {
            method: "DELETE"
        });

        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
    }

    // This method will map out the records on the table
    function recordList() {
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    deleteRecord={() => deleteRecord(record._id)}
                    key={record._id}
                />
            );
        });
    }

    // This following section will display the table with the records of individuals.
    return (
        <div>
            <h3>Record List</h3>
            <table className="ant-table ant-table-bordered" style={{marginTop: 20}}>
                <thead className='ant-table-thead'>
                <tr>
                    <th>Tên đơn vị</th>
                    <th>Điểm</th>
                    <th>Thao tác</th>
                </tr>
                </thead>
                <tbody className="ant-table-tbody">{recordList()}</tbody>
            </table>
        </div>
    );
}
