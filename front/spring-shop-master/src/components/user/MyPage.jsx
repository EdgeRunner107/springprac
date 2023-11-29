import React ,{useEffect, useState}from 'react'
import axios from 'axios'
import { InputGroup,Row,Col,Form } from 'react-bootstrap';
import ModalPost from './ModalPost';

const MyPage=()=> {
    const [form,setForm] =useState('');
    const {uid,uname,address1,address2,phone} = form; //비구조할당 중괄호

    const getUser=async()=>{
            const res= await axios(`/user/read?uid=${sessionStorage.getItem('uid')}`);
            console.log(res.data);

            setForm(res.data);

    }
    const onChangeForm=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    useEffect(()=>{
        getUser();
    },[]);


    const onPostcode =(address)=>{
        setForm({
            ...form,
            address1: address
        })
    }
    const onReset =(e)=>{
        e.preventDefault();
        getUser();
    }

    const onSubmit = async(e)=>{
        e.preventDefault();
        if(window.confirm("Are you sure to submit?")){
                await axios.post("/user/update",form);
                alert("수정완료");
                window.location.href="/";
        }
    }


  return (
    <div className='my-5'>
        
        
        <h1 className='text-center mb-5 text-glow font-bold text-xl my-5'>MyPage</h1>
        <Row>
            <Col md={8}>
                <form onReset ={onReset} onSubmit={onSubmit}>
                    <InputGroup >
                        <InputGroup.Text className="custom-input-group mb-2"  >ID</InputGroup.Text>
                        <Form.Control className="custom-input-group mb-2" value={uid} readOnly/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text className="custom-input-group mb-2">NAME</InputGroup.Text>
                        <Form.Control className="custom-input-group mb-2" value={uname} onChange = {onChangeForm} name="uname"/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text className="custom-input-group mb-2">P-NUM</InputGroup.Text>
                        <Form.Control className="custom-input-group mb-2" value={phone} onChange = {onChangeForm} name="phone"/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text className="custom-input-group mb-2">ADDR</InputGroup.Text>
                        <Form.Control className="custom-input-group mb-2" value={address1} onChange = {onChangeForm} name="address1"/>
                
                        <ModalPost onPostcode={onPostcode} />
                    </InputGroup>
                    <InputGroup className='mb-2'>
                    <InputGroup.Text className="custom-input-group mb-2">A-ADDR</InputGroup.Text>
                    <Form.Control className="custom-input-group mb-2" value={address2} name='상세주소'/>
                    </InputGroup>
                    <div className='text-center mt-3'>
                        <button className="custom-input-group2 mb-2" type="submit">SUBMIT</button>
                        <button className="custom-input-group2 mb-2" type="reset">CANCLE</button>
                    </div>
                </form>
            </Col>
            <Col md={4}>

            </Col>


        </Row>
        
        </div>
  )
}

export default MyPage