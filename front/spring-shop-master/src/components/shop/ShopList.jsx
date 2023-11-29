import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Row, Col, Table, Spinner, InputGroup, Form, Button} from 'react-bootstrap'
import "../Pagination.css";
import Pagination from "react-js-pagination";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ShopList = () => {
    const navi = useNavigate();
    const location=useLocation();
    const search = new URLSearchParams(location.search);

    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const size=5;
    const page=search.get("page") ? parseInt(search.get("page")) : 1;
    const [query, setQuery] = useState("");

    const getList = async() => {
        setLoading(true);
        const res=await axios.get(`/shop/list.json?page=${page}&size=5&query=${query}`);
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }

    useEffect(()=>{
        getList();
    }, [location]);    

    const onSubmit = (e) => {
        e.preventDefault();
        navi(`/shop/list?page=1&size=${size}&query=${query}`);
    }

    const onDelete = async(shop) =>{
        if(window.confirm(`${shop.pid}번 상품을 삭제하실래요?`)){
            await axios(`/shop/delete?pid=${shop.pid}`);
            await axios(`/deleteFile?file=${shop.image}`);
            alert("삭제완료!");
            navi(`/shop/list?page=1&size=${size}&query=${query}`);
        }
    }

    if(loading) return <div className='text-center my-5'><Spinner/></div>
    return (
        <div className='my-5'>
            <h1   className='custom-TDS2 mb-2 text-end text-center mb-5'>LIST</h1>
            <Row className='mb-2'>
                <Col md={5}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control className='custom-TDS mb-2' onChange={(e)=>setQuery(e.target.value)}
                                placeholder='상품명, 제조사' value={query}/>
                            <Button  className='custom-TDS2 mb-2'type="submit">SEARCH</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <span className='customjusttextPINK2'  >ALL : {total} 개</span>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td className='custom-TDS mb-2 text-end' colSpan={2}>ID</td>
                        <td className='custom-TDS mb-2 text-end'>상품명</td><td className='custom-TDS mb-2 text-end'>상품가격</td>
                        <td className='custom-TDS mb-2 text-end'>제조사</td><td className='custom-TDS mb-2 text-end'>등록일</td>
                        <td className='custom-TDS mb-2 text-end'>조회수</td>
                        <td className='custom-TDS mb-2 text-end'>삭제</td>
                   
                    </tr>
                </thead>
                <tbody>
                    {list.map(s=>
                        <tr key={s.pid}>
                            <td  className="custom-TDS2 mb-2">{s.pid}</td>
                            <td  className="custom-TDS2 mb-2"><img src={`/display?file=${s.image}`} width="50px"/></td>
                            <td  className="custom-TDS2 mb-2">
                                <Link to={`/shop/update/${s.pid}`}>
                                    <div className='ellipsis'>{s.title}</div>
                                </Link>
                            </td>
                            <td  className='custom-TDS2 text-end'>{s.fmtprice}원</td>
                            <td  className="custom-TDS2 mb-2">{s.maker}</td>
                            <td  className="custom-TDS2 mb-2"><div className='ellipsis'>{s.fmtdate}</div></td>
                            <td  className="custom-TDS2 mb-2">{s.viewcnt}</td>
                            <td  className="custom-TDS2 mb-2"><Button onClick={()=>onDelete(s)}
                               className='custom-TDS mb-2 text-end text-center mb-5'>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
                <Pagination 
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(cpage)=>{navi(`/shop/list?page=${cpage}&size=${size}&query=${query}`)}}/>
            }
        </div>
    )
}

export default ShopList