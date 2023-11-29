import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Table, Button, Row, Col, InputGroup, Form, Alert} from 'react-bootstrap'
import "../Pagination.css";
import Pagination from "react-js-pagination";
import OrderPage from './OrderPage';




const CartList = () => {
    const [isOrder, setIsOrder]=useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [sum, setSum] = useState(0);
    const [cnt, setCnt] = useState(0);
    const [page, setPage] = useState(1);
    const [checkSum, setCheckSum] = useState(0);
    const size=3;
    const uid=sessionStorage.getItem("uid");

    const getList = async() => {
        const res=await axios(`/cart/list.json?page=${page}&size=${size}&uid=${uid}`);
        //console.log(res.data);
        const data=res.data.list.map(c=> c && {...c, checked:false});
        setList(data);
        setTotal(res.data.total);
        setSum(res.data.sum);
    }

    useEffect(()=>{
        getList();
    }, [page]);

    useEffect(()=>{
        let count=0;
        let sum=0;
        list.forEach(c=>{
            if(c.checked){
                count++;
                sum+=c.sum;
            }
        });
        setCnt(count);
        setCheckSum(sum);
    }, [list]);

    const onDelete = async(cid) => {
        await axios.post(`/cart/delete/${cid}`);
        getList();
    }
    const onChangeAll = (e) => {
        const data=list.map(c=>c && {...c, checked:e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, cid) => {
        const data=list.map(c=>c.cid===cid ? {...c, checked:e.target.checked} : c);
        setList(data);
    }

    const onDeleteChecked = async() => {
        if(cnt == 0) {
            alert("삭제할 상품을 선택하세요!");
        }else{
            for(const c of list){
                if(c.checked){
                    await axios.post(`/cart/delete/${c.cid}`);
                }
            }
            getList();
        }
    }

    const onChangeQnt = (e, cid)=>{
        const data=list.map(c=> c.cid===cid ? {...c, qnt:e.target.value} : c);
        setList(data);
    }

    const onUpdateQnt = async(cid, qnt) => {
        await axios.post("/cart/update/qnt", {cid, qnt});
        alert("수정완료!");
        getList();
    }

    const onClickOrder =()=>{
        if(cnt===0){
            alert("주문할상품선택")
        }else{
            setIsOrder(true);
        }
    }


    return (
        <>
            {!isOrder ?
        <div className='my-5'>
            <h1  className='custom-TDS2 mb-2 text-end text-center mb-5'>CART</h1>
            <Row className='mb-2'>
                <Col className ="customjusttext">
                    ALL : <span>{total}</span> EA
                </Col>
                <Col className='text-end'>
                    <Button onClick={onDeleteChecked}
                        className='custom-TDS mb-2 text-end text-center mb-5'>DELETE</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead className='text-center'>
                    <tr>
                        <td className='custom-TDS mb-2 text-end'><input checked={list.length===cnt}
                            type="checkbox" onChange={onChangeAll}/></td>
                        <td className='custom-TDS mb-2 text-end' colSpan={2}>상품명</td>
                        <td className='custom-TDS mb-2 text-end' >가격</td>
                        <td className='custom-TDS mb-2 text-end'>수량</td>
                        <td className='custom-TDS mb-2 text-end'>합계</td>
                        <td className='custom-TDS mb-2 text-end'>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(c=>
                    <tr key={c.cid}>
                        <td className="custom-TDS2 mb-2"><input onChange={(e)=>onChangeSingle(e, c.cid)}
                                type="checkbox" checked={c.checked}/></td>
                        <td  className=' custom-TDS2 mb-2 text-center'>
                
                            <img src={`/display?file=${c.image}`} width="50"/>
                        </td>
                        <td className="custom-TDS2 mb-2">[{c.pid}] {c.title}</td>
                        <td className='custom-TDS2 mb-2 text-end'>{c.fmtprice}원</td>
                        <td className="custom-TDS2 mb-2">
                            <InputGroup >
                                <Form.Control  className='custom-TDS2' onChange={(e)=>{onChangeQnt(e, c.cid)}}
                                    value={c.qnt} type="number"/>
                                <button onClick={()=>onUpdateQnt(c.cid, c.qnt)} 
                                   className='customjusttextPINK'   >수정</button>
                            </InputGroup>
                        </td>
                        <td className='custom-TDS2 text-end'>{c.fmtsum}원</td>
                        <td className='custom-TDS2 text-end'><button onClick={()=>onDelete(c.cid)}
                              className='customjusttextPINK'    >삭제</button></td>
                    </tr>
                    )}
                </tbody>
            </Table>
            <Alert className='custom-TDS2 mb-2 text-end'>
                <Row >
                    <Col >
                        선택총액: {checkSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                    </Col>
                    <Col className='text-end'>
                        전체총액: {sum}원
                    </Col>
                </Row>
            </Alert>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(page)=>setPage(page)}/>
            }
                    <div>
                        <button className='custom-TDS2 mb-2 text-end' onClick={onClickOrder}> ORDER</button>
                    </div>

                 
        </div>
        :
           <OrderPage list={list} checkSum={checkSum}/>
        }
    </>
    )
}

export default CartList