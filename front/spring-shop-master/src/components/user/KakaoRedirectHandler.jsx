import React, { useEffect,useState } from "react";
import axios from 'axios';
import queryString from 'query-string';
import {jwtDecode} from 'jwt-decode'; // 수정된 import
import { useNavigate } from 'react-router-dom';
import {setCookie} from "../../common.js";
const KakaoRedirectHandler = () => {
  const navigate = useNavigate(); // 수정된 위치



  useEffect(() => {
    const fetchToken = async () => { // async function 내부로 변경
      let params = new URL(document.location.toString()).searchParams;
      let code = params.get("code");
      const data = queryString.stringify({
        grant_type: "authorization_code",
        client_id: "edb2e3648fa374acbe7be705a5474a8a",
        redirect_uri: "http://localhost:3000/oauth/callback/kakao",
        code: code,
      });

      try {
        const response = await axios.post('https://kauth.kakao.com/oauth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
        });
        console.log(response)
        console.log(response.data.access_token)
        console.log(response.data.refresh_token)
        // JWT 토큰을 디코드합니다.
        const decodedToken = jwtDecode(response.data.id_token);
        console.log(decodedToken.nickname);
        console.log(decodedToken.email);
        console.log("요청전1");
        const form = {
          uid: decodedToken.email,
          uname: decodedToken.nickname,
          upass: decodedToken.email
      };

   
        // 서버에 로그인 요청을 보냅니다.
        console.log("요청전");
        const loginResponse = await axios.post('/user/kakaologin',form ); 
        console.log("요청후");
        console.log(loginResponse.data);
        if (loginResponse.data=='1') {
          alert(`안녕하세요, ${decodedToken.nickname} 님`);
          sessionStorage.setItem("uid",decodedToken.nickname);
          navigate('/');
        } else {
          await axios.post('/user/kakaoinsert',form );
          alert("아이디 없음 가입 함 ");  //섭밋같은 확인 or 취소로 바꿔야함 모달에 넣어도될듯
                

                const loginResponse2 = await axios.post('/user/kakaologin',form ); 
                  if (loginResponse2.data=='1') {
                          alert(`안녕하세요, ${decodedToken.nickname} 님`);
     
                           sessionStorage.setItem("uid", decodedToken.nickname);
                           navigate('/');
                  }else{
                    alert("네트워크 오류");
                  }
       
        
        }
      } catch (error) {
        // 에러 핸들링
        console.error("토큰 요청 에러", error);
      }
    };

    fetchToken(); // async function 호출
  }, [navigate]); // useEffect 의존성 배열에 navigate 추가

  return <div>이 페이지는 로그인 처리 후 첫 화면으로 이동시켜주는 역할을 합니다.</div>;
};

export default KakaoRedirectHandler;