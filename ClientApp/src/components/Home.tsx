import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
    <div>
        <h1>안녕하세요!!</h1>
        <p>.NET Core & 리액트, 리덕스를 이용한 프로젝트입니다</p>
        <ul>
            <li>Dapper를 이용한 MSSQL 디비 연동</li>
            <li>Cookie를 이용한 로그인/로그아웃 기능</li>
            <li>SummerNote 웹에디터를 적용한 게시판 기능</li>
            <li>리액트 프론트엔드 프레임워크와 타입스크립트를 이용한 SPA 화면 구성</li>
            <li>리덕스 라이브러리를 이용한 state 통합 기능</li>
        </ul>
    </div>
);

export default connect()(Home);
