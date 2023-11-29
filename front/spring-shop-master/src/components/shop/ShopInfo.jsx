import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Button, Tab, Tabs } from 'react-bootstrap'
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import ReviewPage from './ReviewPage';

const ShopInfo = () => {
    const { pid } = useParams();
    const [shop, setShop] = useState('');
    const { title, maker, image, fmtprice, fmtdate, ucnt, fcnt } = shop;
    const getShop = async () => {
        const res = await axios(`/shop/info/${pid}?uid=${sessionStorage.getItem("uid")}`);
        setShop(res.data);
    }

    useEffect(() => {
        getShop();
    }, []);

    const onClickRegHeart = async () => {
        if (!sessionStorage.getItem("uid")) {
            sessionStorage.setItem("target", `/shop/info/${pid}`);
            window.location.href = "/login";
        } else {
            //좋아요추가
            await axios(`/shop/insert/favorites?pid=${pid}&uid=${sessionStorage.getItem("uid")}`);
            alert("좋아요추가!");
            getShop();
        }
    }

    const onClickHeart = async () => {
        await axios(`/shop/delete/favorites?uid=${sessionStorage.getItem("uid")}&pid=${pid}`);
        alert("좋아요삭제!");
        getShop();
    }

    const onClickCart = async() => {
        await axios.post("/cart/insert", {uid:sessionStorage.getItem("uid"), pid})
        if(window.confirm("쇼핑을 계속하실래요?")){
            window.location.href="/";
        }else{
            window.location.href="/cart/list";
        }
    }


    return (
        
        <div class="cb pr-4 pb-4">
            <h1  className='text-center mb-5 text-glow font-bold text-xl'> Product Info</h1>
            <div class="delimiter2 my-4"></div>
            <Row className='mx-5'>
                <Col md={4}>
                    <img src={`/display?file=${image}`} width="90%" className='image'/>
                </Col>
                <Col className='text-glow font-bold text-xl" mt-3'>
                    <h5>
                        [{pid}] {title}
                        <span className='heart mx-2'>
                            {ucnt === 0 ? <FaRegHeart onClick={onClickRegHeart} /> : <FaHeart onClick={onClickHeart} />}
                            <small style={{ fontSize: '0.7rem' }} className='ms-1'>{fcnt}</small>
                        </span>
                    </h5>
                    <hr/>
                    <div>Price: {fmtprice}원</div>`   `
                    <div>Brand: {maker}</div>
                    <div>Date: {fmtdate}</div>
                    <hr/>
                    <div className='text-center'>
                        <button  className=' cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>Purchase now</button>
                        <button   onClick={onClickCart} className=' cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>Add Cart</button>
                    </div>
                </Col>
            </Row>
            <div class="delimiter2 my-4"></div>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="my-5">
                <Tab eventKey="home" title="상세설명">
                    상세설명
                </Tab>
                <Tab eventKey="profile" title="상품리뷰">
                    <ReviewPage pid={pid}/>
                </Tab>
            </Tabs>
    
</div>

    )
}

export default ShopInfo