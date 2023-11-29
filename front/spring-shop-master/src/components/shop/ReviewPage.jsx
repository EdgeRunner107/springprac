import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Button, Form} from 'react-bootstrap'
import "../Pagination.css";
import Pagination from "react-js-pagination";

const ReviewPage = ({pid}) => {
    const [body, setBody] = useState('');
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [total, setTotal]= useState(0);
    const size=3;

    const getList = async() => {
        const res=await axios(`/review/list.json?page=${page}&size=${size}&pid=${pid}`);
        let data =res.data.list.map(r=>r && {...r,ellipsis:true, view:true ,text: r.body});
     
     
        console.log(res.data)
        setList(data);
        setTotal(res.data.total);

    }

    useEffect(()=>{
        getList();
    }, [page]);

    const onRegister = async() => {
        if(body===""){
            alert("리뷰내용을 작성하세요!");
        }else{
            const data={pid, uid:sessionStorage.getItem("uid"), body}
            await axios.post("/review/insert", data);
            setBody("");
            getList();
        }
    }

    const onClickBody = (cid) => {
        const data= list.map(r => r.cid==cid ? {...r, ellipsis:!r.ellipsis} : r);
        setList(data);
    }
    const onDelete = async (cid) =>{
        if (window.confirm(`${cid}번 리뷰삭제할래?`))
        await axios.post(`/review/delete/${cid}`);
        getList();
    }

    const onUpdate = async (cid) =>{
        const data = list.map(r=> r.cid===cid ? {...r,view:false}: r);
        setList(data)

    }

    const onCancle = async (cid) =>{
        const data = list.map(r=> r.cid===cid ? {...r,view:true, body:r.text}: r);
        setList(data)

    }

    const onChangeBody = (e, cid)=> {
        const data = list.map(r=>r.cid===cid ? {...r, body : e.target.value} : r);
        setList(data);

    }

    const onClickSave = async(cid,body,text) =>{
        if(body===text){
            onCancle(cid);
        }else{
            if(window.confirm(`${cid}번 리뷰를 수정할래?`)){
                await axios.post("/review/update",{cid,body});
                alert("수정완료");
                getList();
            }   
        }
       
    }


    return (
        <div  class="cb pr-4 pb-4" >
            {sessionStorage.getItem("uid") ?
                <div>
                    <Form.Control  className='custom-TDS3 px-5'  onChange={(e)=>setBody(e.target.value)} value={body}
                        as="textarea" rows={5} placeholder='리뷰내용을 입력하세요.'/>
                    <div className='text-end mt-2'>
                        <button onClick={onRegister}
                           className=' cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>등록</button>
                    </div>    
                </div>
                :    
                <div>
                    <Button className='w-100'>로그인</Button>
                </div>    
            }
                  <div class="delimiter2 my-4"></div>
            <div><span className="cb pr-4 pb-4 navbar-custom-color" >리뷰수:{total}</span></div>
            <hr/>
            <div>
      
                {list.map(r=>
                    <div key = {r.cid}>
                        <div>
                            <small className="cb pr-4 pb-4 navbar-custom-color" >{r.regdate}</small>
                            <small className='ms-2 cb pr-4 pb-4 navbar-custom-color'>({r.uid})</small>
                        </div>
                        {r.view ?
                        <>
                        <div onClick = {()=> onClickBody(r.cid)} 
                        className={`${r.ellipsis ? 'ellipsis2 ' : ''}cb pr-4 pb-4 navbar-custom-color`} style = {{cursor: 'pointer'}}>[{r.cid}]{r.text}
                           </div>
                                {sessionStorage.getItem("uid") ===r.uid &&
                                <div className='text-end'>
                                <button onClick = {()=> onDelete(r.cid)} className='cb2 flex flex-grow items-center justify-center cursor-pointer px-5'> 삭제</button>
                                <button onClick = {()=> onUpdate(r.cid)} className='cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>수정 </button>
                                </div> 
                                }
                        </>
                            :
                                <div>
                                    <Form.Control onChange={(e)=> onChangeBody(e,r.cid)}
                                     as = "textarea" rows = "5" value={r.body}/>
                                     <div className='text-end mt-2'>
                                           <button onClick ={()=> onClickSave(r.cid,r.body,r.text)}
                                           className='cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>저장</button>
                                           <button  onClick = {()=> onCancle(r.cid)}  className='cb2 flex flex-grow items-center justify-center cursor-pointer px-5'>취소</button>
                                     </div>
                                </div>
                            }
                        <hr/>
                    </div>
                )}
            </div>
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
        </div>
    )
}

export default ReviewPage