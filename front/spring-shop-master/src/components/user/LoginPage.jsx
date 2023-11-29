import axios from 'axios';
import React, { useState } from 'react'
import {Form, Card, Row, Col, Button} from 'react-bootstrap'
import {setCookie} from "../../common.js";
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const [form, setForm] = useState({
        uid:'',
        upass:''
    });
    const {uid, upass} = form;

    const CLIENT_ID = "edb2e3648fa374acbe7be705a5474a8a";
    const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao";
    // 프런트엔드 리다이랙트 URI 예시
    // const REDIRECT_URI =  "http://localhost:3000/oauth/callback/kakao";
  
    // 백엔드 리다이랙트 URI 예시
    // const REDIRECT_URI =  "http://localhost:5000/kakao/code";
  
  
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
  

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        const res=await axios.post("/user/login", form);
        if(res.data==0) {
            alert("아이디가 존재하지 않습니다!");
        }else if(res.data==2) {
            alert("비밀번호가 일치하지않습니다!");
        }else{
            console.log(uid);
            if(checked){
                setCookie("uid", uid, 7);
            
            }
            console.log(uid);
            sessionStorage.setItem("uid", uid);
            if(sessionStorage.getItem("target")){
                window.location.href=sessionStorage.getItem("target");
            }else{
                window.location.href="/";
            }
          
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>로그인</h1>
            <Row className='justify-content-center'>
                <Col md={6}>
                    <Card className='p-3 mx-5'>
                        <form onSubmit={onSubmit}>
                            <Form.Control name="uid" value={uid} onChange={onChange}
                                placeholder='아이디' className='mb-2'/>
                            <Form.Control name="upass" value={upass} onChange={onChange}
                                placeholder='비밀번호' className='mb-2' type="password"/>
                            <Button className='w-100' type="submit">로그인</Button>
                        </form>
                        <div className='mt-2 text-end'>
                            <input type="checkbox" onChange={(e)=>setChecked(e.target.checked)}
                                checked={checked} /> 
                            <span className='ms-2'>로그인 상태저장</span>
                        </div>
                    </Card>
                </Col>
                <Button 
                      href={KAKAO_AUTH_URL}   className='custom-TDSkakao '>카카오로그인</Button>
            </Row>
           

        </div>
    )
}

export default LoginPage