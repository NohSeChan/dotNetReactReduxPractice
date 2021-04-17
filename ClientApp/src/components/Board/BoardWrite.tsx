import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import * as utils from '../../utils/util';
import $ from "jquery";
import 'summernote';
import 'summernote/dist/lang/summernote-ko-KR';
import 'summernote/dist/summernote.css';
import 'bootstrap';
import { Table } from 'reactstrap';

//type BoardProps =
//    CounterStore.CounterState &
//    typeof CounterStore.actionCreators &
//    RouteComponentProps<{}>;


interface writeType {
    boardTitle: string;
    boardAuthor: string;
    boardContents: string;
}

class BoardWrite extends Component<writeType> {
    state = {
        boardTitle: '',
        boardAuthor: '',
        boardContents: '',
    }

    componentDidMount() {
        var myCookie = document.cookie.match('(^|;) ?' + 'userName' + '=([^;]*)(;|$)');
        var userNameAscii = myCookie && myCookie[2] || '';
        this.setState({
            boardAuthor: utils.asciiToStr(userNameAscii.split(','))
        });

        $('#summernote').summernote({
            height: 300,                 // 에디터 높이
            lang:'ko-KR',
            focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
            placeholder: '게시글을 입력해주세요'
        });
    }

    onChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = () => {
        fetch(`WriteBoard`, {
            method: 'post',
            body: JSON.stringify({
                BOARDTITLE: this.state.boardTitle,
                BOARDAUTHOR: this.state.boardAuthor,
                BOARDCONTENTS: $('#summernote').summernote('code')
            }),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    document.location.href = "/board";
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    public render() {

        return (
            <React.Fragment>
                <h1>기본 게시판 구현</h1>
                <br />
                <Table style={{border: "solid 1px"}}>
                    <colgroup>
                        <col style={{ "width":"90px" }} />
                        <col style={{ "width":"auto" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "729px" }}
                                    name="boardTitle"
                                    value={this.state.boardTitle}
                                    onChange={this.onChange}
                                    placeholder="제목을 입력해주세요"
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>내용</th>
                            <td><input type="text" id="summernote" name="boardContents" value={this.state.boardContents} onChange={this.onChange} /></td>
                        </tr>
                    </tbody>
                </Table>
                <button onClick={this.handleSubmit}>작성완료</button>
                &nbsp;&nbsp;
                <Link to='/board'><button type="button">취소</button></Link>
            </React.Fragment>
        );
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default BoardWrite;
