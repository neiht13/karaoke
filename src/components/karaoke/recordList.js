import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Button, Card, Col, Input, Modal, Row, Tag} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import axios from 'axios';

import "./style.css"
import karaoke from "./../../karaoke.json"
const {Meta} = Card;

const Record = (props) => (
    <tr>
        <td>{props.record.name}</td>
        <td>{props.record.position}</td>
        <td>{props.record.level}</td>
        <td>
            <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
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

export default function Karaoke() {
    const [records, setRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputBgk, setInputBgk] = useState();
    let currentBgk = localStorage.getItem("bgk");

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        localStorage.setItem("bgk", inputBgk);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // This method fetches the records from the database.
    useEffect(() => {
        if (!currentBgk) {
            setIsModalOpen(true);
        }
    },[]);
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/karaoke`);


            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            // setRecords(karaoke.data);
            setRecords(records);
            await fetch(`https://data.mongodb-api.com/app/data-sgxvu/endpoint/data/v1/action/find`,{
                method: 'post',
                mode:'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'Accept': '*/*',
                    'api-key': '3T0AJq674kua5xCKYoZeWEAqbCdlgidtfqWxwJ0O5G0lzW1bD55xzwaXtllwSK2z',
                },
                body: data
            }).then(function (response) {
                console.log(JSON.stringify(response.data));
            })
                .catch(function (error) {
                    console.log(error);
                });
        }
        var data = JSON.stringify({
            "collection": "employees",
            "database": "karaoke",
            "dataSource": "Cluster0",
            "projection": {}
        });

        var config = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-sgxvu/endpoint/data/v1/action/find',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : '*',
                "crossdomain": true,
                'api-key': '3T0AJq674kua5xCKYoZeWEAqbCdlgidtfqWxwJ0O5G0lzW1bD55xzwaXtllwSK2z',
            },
            crossdomain: true,
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });



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
            let score = 0;
            if(record.scores && record.scores.length >0) {
                if (currentBgk === "MC") {
                    record.scores.forEach(r => {
                        score = score + r.total;
                    })
                    score = Math.round(score / record.scores.length * 10) / 10
                } else {
                    let list = record.scores.filter(r => r.gk === currentBgk);
                    list && list.length > 0 && list.forEach(r => {
                        score = score + r.total;
                    })
                }
            }
            return (
                <Col span={8} >
                    <Link to={`/karaoke/edit/${record._id}`}>
                        <Card title={record.name} bordered={false}
                              style={{
                                  height: "200px",
                                  textAlign: "center",
                                  marginBottom: "8px",
                                  borderRadius:"8px",
                                  boxShadow: "#0066aa80 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px"
                              }}>
                            <div style={{
                                heigth: "inherit",
                                backgroundImage: 'url("data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAAGICAMAAACeDRD0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhFBMVEX////////////////////////////////////////////////////////////////7/P7r8viox+J+rNXf6vRmnM05f74kcbdPjcWVutwRZbH0+Pu+1erQ4fD+/v////////////////////////////////////////////////8AWqtLqLddAAAAKnRSTlMAIECAn1Cvz9+/j+8wcGAQ48+/w8jI2OPPwPDYwMPw3MPC8cvl1sDmwdPEElgvAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+YKCwoQGbJG8tgAAB2GSURBVHja7V1peyo9jk2AsCZhC1sR6Om5PdM95P//vyHcsFlHsuwqV9km+tBPP+8lpjhSaTmS7aenX/GX51ar/S0dU07/tdVq+vnyleeXdrd3sEq/205eCUcj+7GyASfDH3trPdfxQK32YGSH/iKjzmvTEPrIa+ut3R0obMyQ3qDTfg+miNf2wPmJDodBUi/BEfhB3+NXmnpov1dreOOXjovd30m3ljez9C9stbvlkb/TQuetItt76ZR6kFG7aXAt8vpWMfQ3Shi+lzS/V3/Lv8hg3DTE/M9zi2g+0u9462D8Vo1hjKKMw8/v3dDYX3QwfHF/vlY5v3OnAI+vDyuvQ/cEp5x0353cwHu1z/feNOC3UiKdKCW9N6UnGrcrj0jRKKAp8M8qsL8Fz8MQTxiFAl6D/DQ36cpIPFfn9iNTwPitbp/PiEAMBEO/cQVUmE5UID0YjUOi36gCqsqkK5TR0AzGY3f0J9Pp7Fvmp/+dTuNUwHOjIZeX7i1DMW47PeTkY7ZYfhFZLWaSEppQQKtbEqajkf1Y2fosmx97m07KLd27APLmgP50ti6+eCnmW+4v66+EX3xo25Nsp5+zxXr5ZZPlej7beSuif9LAi9o9bmdr6xN9fa25l2BULx367uX2j8CvV4pfaephttt6fFv//VVpI/uPeaF9mgVjEL2o0d9PZwt35O+0MP+0RUFP+Zg7PUgxw8vURkfr3+m/sv0sCf2NEja7koGBPJze8i+y3sOl6vFALSe/v5Ujmo+s5pXpYP/pZxgFdIeDGtB/dkB/sltUjf1FB5uP8uhP3fzOnQLg1wfvCY+HesPf2BOccrLY7dVPA2RX7vl2DbwA6lTaIZ0oJctPT0+0n5WNSNAFBY0ALSXJVhf4ZxW4vwWTTQVPWADVD8Ohr3Q92yp+mqMsdqpHu6Dv7/bvNU+X7geD/0XjevafoX0+IwIxEAr9o4A6IFAEVmU9JdKJCmSpisYVon8U6oHCOCBF3PXNpCuUYmMLxvuKLWRNviEECTG2G/+k1pDLy0JiKPYzy0N+MxxnPzb91NQu9Ouqn8iye/7pomncbzBkY/GniOcSsPs76ytNX4CqA4C9dfShoW1rlBXUwIeAZTHnYsen7R0gHq9iEu7VRrXZbSQGDWx5GynmEpMxsSR0G/MPupXC/5Yg+lQDQthd27KmvayAlfn5KimIsaW/+BEp+oYGWCdiT5i+FSC7IBI1avM908j8PtHAX2imnAGvlMTFVPwW4oAqg/9dzHsmkaP/Lest73pWes5CzO4ICVFVAjQUX8pN09jqhCtL1i6dzIn4FeZLVA3+cs1lTcviFif0jyK+6uZaleD/KlHN04ZItorEwfP8yE5aziThqhjEehVcfyqupzL0jz9ZWnBhfLiCAuxdeJaPpF1PMfNqWUovvElBlMdfgD+FrEeQuWfDWHzlq8ZfIHzSjrtrnxm6v7+7Rvx5+PdpG//64C1iCWYkQCXx5+FP2/N/sVNr9/KP//rngeTeteHPp/1Vt46akMKS9//3n8G/Tv/nf8wfXxP+Yzbt30ZMtTnIpwT+/17+P7FCaU0joS2BPw//p/YHxi4L1gf9ufn//3LB3yjA/PFn4d9H1F8sK0s2CbpVwL8bwJ+FPxPf8yMFWwD/ObBSA/4s/LvU8x5TNhzKFwX80/gHMf+pBn8W/rTpHihsInpWwH9qx5+DP/Gai5EVFwT+YE8k4m/kVF74c/Bv06aaWSm4mYe/yJvhdyatVUH+z8Kfm+u/CrOH7qSA/zP/Y2D8Ofh32h+TonBc6B9Qfrk0wNzxf0j4j5UAqwCSiIoJuBFL3PFnOJ8MCB9ZuCj8x3T/Yvpfmn9mGM/s4ed2kVKRJ4BK4v+48H/hTYxURParKIf/EH5jnmm/rwJEWzTbOm9O8ONe7z7TtB/Ixg6/HH5N/J3mfx4e/mMeaoVfnn+blcAfz/k8FPwKBch5eAn8f+E/iU0BcipiMhn6c7DGeL78UULvVSwKkNsfZk9ZDz8uex8j8bwXUQGy+zfTfz3+3V/4LyIpQO59F8anR1r4cd2VYbdFJYIC5Oa3mX5q93/hzDNzyk0QVgF7t79T4v/6C78FyLN8yH9mpp86+uEZZp4Zt1sUwnRkLAFx6oV/7xd+KpgLsoBiNhFU95HA2LvPaszHR5ACLO6nMD+vKX9h7H24sheACfoBFvdDhto1sRc6/4xmDL0FHOlmcT9m0FCk/7jufcy6yxTSE7ZlhCb7o0g/hwj+R848b8XczWjzCqa+Olb4XxD826Z/dzRy71AsxRc9/sSafo6R8588eOZ5K3cexbbvgRRt1vQHsm6/qc9V7mKwLSUn+2lsx79B7/Mbe2/l5kSTre2zZsJqS3+g99HH3uLvHS2Ze6uN2jALE0pb+oO8j452WG8+bpQ93c0zrpbPnM7ehoyZLdnCL/I+irq3mH+AWcntJlcVrPZKx0Dcv8z+QO9j7bgs+PMBYz1+r6wsdNGXnj4ph98hgNDGL1mOqMtUAyeTm9o+RbJ/+fhz1HORXZzmuJaZ7SlTlJMHsqaFJPuXq180Zy7W17rDcrLco7Sxzj18UfJHnv1ErLPkfdbaqz1y2p59kanixSbmKc1eoeAreJ+Vy/1CGU5NLG3MM+D+xeqr7eR9HE+KypA+tY8BkuxTOvv52cX7FM6Xa2WoAKsQ/yy5f9DyZb2P6qAiQx6PQ6LX7wi3T7UAZJzX1mxJoJJjEBaFwCRl/yD33OJlC48DMk9vU56VGC+kWd9xM38cYLR7AtX6zFVI8SuRP8D8ccRclrhZNMtKmBXqpccu5o+D79IaeQfCpQAP5YGInxg4mT80VkviM+q8HHX8OuRUYCWsMhLqft5czB+SG/I+nO7Vv3HXjz/Q1iXqfp5dzB+l6xL8o+H98lgDD/QCkDjZczF/BJRwPu+oTWML4jMe5wWgxRd/82NXhZMQetswsqPreR7mBaAHubLc57MKJh7+AefYUD/nUVIg4n744hcwP9T8Vxz8faGqAC4om4NyZSGDD7z7GWvMn616O2JHmXog28BkJkI5Gtb9ACOl5s8cDD6y7KYBkf0haLiCugkHG6Xmz1BuA+tltjSzfYhGAM3UWfcDRq7W9uXkNaUX4CEcEPXWbPFFLZSYP059RqqLrOjyOU5DmICRH80WXyD5ND10ASnPke4cFfoCZNiLN4W6a5b7GZKPEuYH9np7zyr4QXj58PlFSUlB/QWLFh06MZkf2G3sq6+RJzc05x8AaLhkBx9o9DXhgc5f6Xy+hZYX2ZfANPqyoZJSPzPrYge3M+TIV+ReAVCekp27ArWvYZ3w0AmnKzzJWGPubUgafTtqbMzouETw2/ewijrOPAAXFDDWW9Od7kbthbxPTx178ZdkzkFTj+GQ/E9sax2dmTbzPMvQXKFphMIKrZZYd01yQ6M4gqSz6gCbW3l5KPxp8jli/QV1P/dDJ4j1VJA+hpAAkHUCSjFjwyV1P/ehcQHgd3X+32KWwDk3gUGTnI2+1P3cpeaQ99EXXlfpPhD+NPnkx64IN3lf+6Lg63V5Vftx8KdTV3z0pcXXXW8EsEjCDIskZgDOmAGl5s/vOaLF11Jeys/7UA463wIY2CzvMcjcw13yD94k76s7HwZ/4LL5aolQz3ezIcD89aTzg+IPzJ/nauh01K37QcOGTjeXPCL+GxfMyNzJnfsBpVfXAfE7eRj/TxN2l5n/W/cDzN+Z92Hxz7UBAMZEBKaefPY2LQfe3//e+EfJ/6n5CzseyWDCbfEFaP+Rb/ClBGim+LuZP3H/t8XX1GkpmwweA39q/pLNEvd/M/cAvH9fDzcRk3/Lk/8E5i+5bPLhG+q5WvMnX9U0UmHEzfyJ+99eVwLmr701RvVVTSMVRID5S60Swj3fJOXA/L1LL/BVefZ/AVkvJexkKucaFAHzU8b8Cc+UJf7A/MUxETKWeV2Kbh0r5f1JlzPL8tfR/An3f2OUlETyo/25r8qR/nc1fxITr0YJur5lvD/9qhzTf2T+kv23eVBcOpgaIV+VYfqPzH84FBRAwu9lKcBhlzJ/Wug1DVYAAeY/Go0EBfAzgVSV5cyfVF8Zpj/MgWyCAsyPXrlnutulnPm3+K/KRQpubzqrAALKhZIvyCJlmJ8nMP2Z30GIzMWQggLI6MMlJlL38+YIuCFkxjG7/Y+FcCgVowAzJ7ly/zT78ef9v4XMOOa3/Us8DxIrwEx/rjGR6NK768u8admF39VBlBFi4cyc8FJ90eKrFPUAEt3s2AfbUcxoAM78zCX8Eu6nRNvxW+iMY27Vr3Aq2I8oULnERFJIuO31sruf7Kov5mSYG6H5O9sRoX13590uFveTm/tfHKxC8X/hQCGFnOK6Wjf3kxv5qTgOmHaBzfTzMvpAYknl7iez7J8vvVzwv+QkJPssmf0Q7s1+Z01SAksv85UYWGE5pz/U/VdcfOV2+hUsvUwnbsf/nBMS91+y+KJHy+U1+glPB9gXxn+gBJrZ/D2v53ZflV1Ikzkz8gHmnh9f5n8huHCokGDuPfJ8Enr2VV7uB+eeG6IWG/6X9NNcqlTfHR3smpf7wbnnkuBv7pozw+J51zUppd33uktfk5v7wbnnhP6DWYBx+1HIguWKXxp9s3I/zInMO3/8SfgtlX2C+wyz4t4Y3nNB/YhZRLUYWEx/Vs7909MNsiq+ON6zoP9kFsAmK/CDf2EuVc7903ONs6L+GeLnO5cxOzIm/qZjXjEaLeX+wW22OQ1eccTPiV90xJ9bslT2rznWO11hr0NY+eNPyIyKzT+nwROu6bg9/atxap4F/3NYNMuGUnNv1Pxzir5s03GDkDRZNAP/s18w1/Lf8AvNP6PoW7BdlyXC3zRkjD+ZoygTfsHFI9brutMRtuvy844bnlyHP3mnSoRfYP4ZjX1C2vnG/Zj6seC/w0ot0fodg5u/Mko++ZGHlQ/+P47ZHP0pEX7BlT4ZUT/89d/brxL4m1r1D7+A+cnI/IVx2/Nwhxf+5lHP/q33vM1fmDc8pxhe+JuLeW+7yNv8hYGrD+YzKvwLc7Vf80dSCANXl+6ekUqq8DfTT+9tL3mbP9icfpZrd68K/L3Tn6zNX5p2/uQ+pcLfTP990x9wodg+H/OXxj2vv7IK/H1Hf8BttvkwP9K45w297oO/yT57pj/I/LNhfnji4SCdH6bC3za08mv+zF1cZyu7+VwV+PvBDy78zcf8xWHzWyurAH9P9m0gP1jSInqfuxTb2EStwv8g/82v+Yve5/7mFh/+oRL8czZ/eavLWvioD/5e6T+4Szubrq/sfbaSqmrDH7Rdshl6EL2P8TM9+l+FsaAP+wy6jtmYv+x95GsDNf1fk9jwKL/GGZu/ZZe7EeQ85h8qwB8Qb7mMvBXyNl8zx2sEf8Q75zJwLrDOwPxN/Dsy/hOEv7v5D/M1f9sZG2aJY7wtmvnP0vgD4i0X85cOuPoW0t4w/r0W/AHxlstF17YTfkh7wxH/VQX4tzTPlaaAw1Vl8zdLNc3+l7L4DxTPlaasLN6Hmplt/xHa/2X+jSP9j4i3TMzfdsASNTPzhdHsfyyZf4LSKxPizXrCzMr6J+HxB8xDJryzTLtB8yfVgomlmSqiPXtO/A8qvfI46Kqwnm8FvKzpscggP8C/FP8JmIdMiDfxbFXG/MmQypMF/0NJ/J+B+edBvNlST+xlzQ9Zo2XxVar/BUqvPJgHa+oJkwwzZNBjBND5V/74v4LnyoN5kHsunPkvrFCa+M/Bd+nxB6VXHuZvYT0Z8yfpJz1DEp1/6D3/ky3zYD9ZGCcZJl1kP39yCvBXFwCg9MqCebCxngcuyTA9CZ2kNU32W49mpqXd/Ztt6WU/2JnxsubHdOc/e86fo9IrC+ZBcbItTjJIxQz2UYOV7FEDCiq9cjB/u/Pn2hukZgComUa78d3/grpeOZReCufPJRlm1oROETNTxh1QuAr/Ln2sbdPYVSF25896WfNP0RnCHYCZub6mA4ByzxxKL4XzZ5MM84MokBKvXdC/0yRAPfpcOZReCufPelnVKW7oTlKP8wdA7plD6aVx/qyZkdMhkB8hYXNGyzZ7AEa5Zw6ll8L58/dIkGEJCB1Q50z1h6IXy6P0stM+0mlG5ruDD1EFl8KSvNUWgFHumUHppbhRRzAzUn3hOmpI3ycSOGw7gEHumUHXa6lw/sI57hsdiiRybmgCZKmAW07PlYoUVs7/IOZ4xP1jHvMVLGl+s+UEjjxpf2vD9yBPNpG3h0GPpC5AdeIBfCj3TP9yKf5ssRsRghxx/1wWSax3QRMgMQBkSftbp32+ZSssQDDkzjAnueMnDcDS7UdZ5p6awksmWEj04FgEEj0nNAALe+DzpP01sVc8yLQgn2avsCCfXNGv53uQQ/pc6eeemtgrdzdIDcVfYUGosw0t/NgLGFDplXzuaR22OolI75IUhr/Cgljwlj4Am4HmOHGlir2WY5RJ/OBJZFo+rehN5gwFkePElS72yr1VSl0INxiRz87p6WbM65PjZhdV7LVYGQkg0g1GhL7Z0gCAHVCOE1eq2Gs7xJ28QlIPhd4PtSLvTx86oAxPmVHVvbbJDup+JAqZ5jCbguCPHFCGhyxpGo4Ha4wj75B8iBhhELak89NHDgg0fRPf7KLinK3eh1ivhUEeks8vzdew36cJVH6nzKg4Z/tgDa0f5BEGmkV+mhlov085oPxOmdH0ew92dpcuY7k/E1xPbVjCEX+ThAbmbzOMyEXT7z3YfSytnmy3t9Mqdm44IIA/MP+0Sy8d7WCv7+nMlm0PKXVAU0OJFP93jyeLWpSpjz3DoztVrdf3Ulte3Tsgin9u5q9Mfew/kib/NveDMqDdvQMi+Odm/srUR3F7GT2kxr6FnTqg/b0DIvgD80+66auEf2tdiEZfzQnOtJTa3OnRxB+Yf9LEm4710RzlQpMozQYWcEf4nR8z8c/sXjvFmPlJ7K0lwF5rNjCO6XfNb+O4gX9m5q/MPDVXV9KldPcX0RJgcqPJvoF/Xuava3jpykuafOr2L7b6whf3DfzzMn9t5qk5xwvM7Cpvj+3zCuib+APiM13z12aeqrkCSv3Yk/8fm2YV0DfxB7x/uuavhl/TWQI1tHb7+rjPKKBP8Adtr3TNX5l56qpLav762wOHWAFn+K/4Z2X+WvhVe8lBINffnvbcRQq4wH/FH2y3SNb8de3eY+xVFfdUmSMr9XaVTrfPyRH+zhl/MPKWrPlrE39dY4lSD9rDG/4CyyrgBP9Zk2DkLVXzV1LOqsLrCx4PrUw+ZQXcwQ8q5VTNX5v4K5ldoE1t8ikq4A5+NO+fKPGphn+rG6oB3WPXyyuQAu7hB/P+ifL+6sRfF3uR+bvfnXZUAJUb+BH1kGbbSw2/dp4erOdxdw5QwC38gHlL1PzV8CtHykAq1XOH/1sBptzCD2qvNLdbaOsubXKBzof2uTrtqABTbksISj2kOfKmhn+rXBB0cPTUg1439FuSHHnTw6+cJ0YHFGuZNwcZki/Z654vLlGXvcrUB5ZefhfHigKSzxTn/dXwqysbVEh7JD82oclnivP+evjVvhUE3wDmD/peCVIPevjV7zYan3C8t0gjIPlMj3lTsw5620LB14X41AplPtOrvfTw6y/tA8TPyIn41AlgPpOjHvTwazNP7NC8bg23CJiRaxrOGOBH+7X7Dm0vtVDqJ7Xddnr41Yk/vpQzQOmFZqQTSz6DwI9OSQyRe4Lom1jyqWecHTpK8GakAMEX1b5p9b0c4HfgtNCWyRDBF9S+aSWfYeBH8ytBgi9gnpNiPsPADyenAxA/iHlOivl0gN8hqsFVQ1S+KPnXzcTEIWHgh20El4k3BwE7VJsGtXH4IZMXIvVHyf+2aVAbhx+WE44TV1oZki9KJ/oGgh8uGyb3QSd0JFP7OsC/dVkX8Q5hch/kfpKpfV3gd7EpuGV1WB5qpftJhXleBoIfXo7hNXDl5X5SYZ71lJsb/HDdUYCeI+N+Ekn+Q8GPpt18590UQt1PGsl/MPihUwtT+H4LOCAxBXGAf+eUzsHxuV6g1BMeENo0tFXD77QwPCcumPOHB+Q2ja1C9HM+jvDjhcPwDich1PO2aWzjgz9Iz+Wv0LmTBNxPMPjxnslAtM9JXhJ0P9p91c7w46ASLvY+gcb7tml0raKe73flETH8IabdrkKyz+jdT93wh0t9nlDxG7n7KT6sqFcKf7i69yQk+4yc+3EgPB3GrAT49UeceAk57iRu7mdVN/zhaIe/QuauoqaeXSifJOAn7j/quZN1IMaNhT/IqOetEPev35dQv7hUXZXAHzTxPwnJ/iNuvAerur7mTcFPs/94s0+HtN+xhGHeqxrgJ+TPtmmUOXFI+/eO7zBzPHQN8NM9j7Fmn+HSfu69qgN+etxVpMedhGo1HhXL3IpUC/y0+opz7mqhh//D7Rdw9Vw98JMt79umkYbikPg4+k/uvaoJ/qeSj1+P6BMf18jLFRR1wU/Cb4TZf/2Rtzb4ae8rvux/OTloxTXycoqtDX6S/sRH/jhEXseal+WS6oOfsA/R7XnU3pxzcHad7Mo1wk9GTyI77qrQR96Jm+sv2LtQ64SfsD9xVV8OvZapm+vneexa4SfpZ1Rb3h3Ifrf3tuBvoq0XfsK+NQ35rehd/96tZSfs2ejUCj9J/yMKvw50p6PvEfQautlowz+e3pfDviI33yMtHHDIU4d/NOnPXH+Uj5vvkZxa2DkfJGbzNxb2QZ92uvmetVBLjwLtLZXELH/jGD1xSDud+oxiNdEPOmSoxD8K9kfPOLhN+Ig+rd68k8O/aei/5fOglU8X37MWX6q6Ex+MfwTsmz7vmbg4y5UcUeqPvBD/5tN/fd7j0mYsZuKyYefLE8JfX3PtXYiqjazUQSOuP0L81+pOi4vxzy2r1l508fg32/xV8z0uxm9Dv4msn8W/yfJXH3gdjN+GfpO+Jy78N9rA65D2WNEfBd7akgz+q+lBKeqc35LzfEuvsbwnMvzVWedUW/CuFAxSk4E3JvzVWedey/YsFK9T88YfCf5q41fuaFnNNGlsBMb/FEP+qfb8W13cnatepkHQDe3e+Ndff2nTHt1c53qnWm7UFN0TG/5LrfHPFK5n+aksn2vusUeLf6EteD/sbQk1+IdBDHGXwb9W/l/L9kxtjr9Y6NzOt/SjcT0N479SJp0TC9eznKlLt6Pjb8fjeiD+tfV/7cXpX/TFsLvcfOgn5I4yjAx9in9N8w8LnesR0F8tXOz+JJ1Ics5bMedPaikAlCn/nkl6lkfo9VsyYkafzl9tw6Nf6Prrkw1Bv1jPZx/60ZT40Qfbv0LvPlWwkif0r55ntV4vZrPd1A/4qNEH+Aee/7cy8uf3cPotJSC/SnQ5z52YTxv02gV9f7cyiSzft+IfcAJo7ZqwlJduo81djZCjh0NloPWj329H6/avQk5fCkMB2dHv2z7gKJ2A52VXKPTo8wA7wBS2P+xYP+Igg/eYY+6t0MNXK98Co8h5eq3X6vDvvSXgdy5Cb/2tlAMqNnb0R+2jHVSEf1rgP4Hzf6qsgVefimrr1At8bZVXwKibjNu5Cr12ubIu/EJDMfd/4mRZBfTa0eeaUMbgt1QRggtdqXstTksooDd8Sc/wzwJ+9aQ0C6Skebq3ztpLAf1uonZ/kRb4VY7n6Jiy1G1f7BvIOSqgd4Q+sWALpQd+WxkFzHWVLph9VSpgNOi0X2LqopeTF/QbfRWw1GQ8B46VlBTQHwy67fZ7Kx/gzzJAP9f1JLWT199oGWOOkX9tIckP8vsfjTFyTEML3eTft8Qy/ReLtDFMDjsdVnrwD4PEE5YA0mOgso4+nWT96dCo+kUfyPOIgwu0we+xdxsD+UUfy+uIx2y6gaF4tZ7tHBu0v+izIingmAxNZ7PF+iyz2adPazzeKYQYRFZAaRkNf9GXJaQC+m/p8mO1STAFdNNoxTYuQRQw+nX7aqleAXEPn0UnFSugF/nwWXxSpQI6v9m+u1SlgN5vxuMn41558EfDzBnjoNIuCX4ik3/xyvPAG/z+L/hVSMtLA4O3X7dTlTwP3QLxIPUxkPikNVSF4v6g/f5r92Fk3Gq3uwNO2u233Fvj5eT/Aep/AlALSDB4AAAAAElFTkSuQmCC")',
                                backgroundRepeat: "no-repeat",
                                opacity: 0.1,
                                backgroundSize: "cover",
                                height: "100px",
                                width: "100px",
                                position: "absolute"
                            }}/>
                            <Tag color="geekblue">{record.sbd}</Tag>

                            <span style={{ fontWeight: "bold",color: "#0066aa", fontSize:'2em', }}>{score}</span>
                            <span style={{fontSize: "0.75em"}}>điểm</span>
                            <br/>
                            <strong>{record.tietmuc}</strong>
                            <br/>
                            {record.hinhthuc}
                            <br/>
                        </Card>
                    </Link>
                </Col>
            );
        });
    }

    // This following section will display the table with the records of individuals.
    return (
        <div>
            <Row>
            <h3>Danh sách thí sinh</h3>&nbsp;
                {currentBgk === "MC" && <Link to={"/karaoke/chitiet"}><Button>Chi tiết</Button></Link>}
            </Row>
            <div className="card-wrapper">
                <Modal title="Nhập tên ban giám khảo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Input placeholder="Ví dụ: PHT" onChange={e=>{setInputBgk(e.target.value)}}/>
                </Modal>
                <Row gutter={8}>
                    {recordList()}
                </Row>
            </div>
        </div>
    );
}
