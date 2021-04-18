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


interface State {
    boardTitle: string;
    boardAuthor: string;
    boardContents: string;
}

interface Props {
    writeComplete: (maxBoardNo: number, boardTitle: string, boardAuthor: string) => void;
    moveList: () => void;
    boardDetail: BoardDetailType;
    status: string;
    updateComplete: (boardNo: number) => void;
}

interface BoardDetailType {
    boardNo: number,
    boardTitle: string,
    boardAuthor: string,
    boardView: number,
    boardContents: string,
    boardCreateDateTime: string,
    boardUserId: string,
}

class BoardWrite extends Component<Props, State> {
    state = {
        boardTitle: this.props.boardDetail.boardTitle ||'',
        boardAuthor: this.props.boardDetail.boardAuthor || '',
        boardContents: this.props.boardDetail.boardContents || '',
    }

    componentDidMount() {
        console.log(this.state);
        var myCookie = document.cookie.match('(^|;) ?' + 'userName' + '=([^;]*)(;|$)');
        var userNameAscii = myCookie && myCookie[2] || '';
        this.setState({
            boardAuthor: utils.asciiToStr(userNameAscii.split(','))
        });

        $('#summernote').summernote({
            height: 300,                 // 에디터 높이
            lang:'ko-KR',
            focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
            placeholder: '게시글을 입력해주세요',
        });
    }

    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.name;
        if (Object.keys(this.state).includes(key)) {
            this.setState({
                [key]: e.currentTarget.value
            } as Pick<State, keyof State>);
        }
    }

    handleSubmit = () => {
        if (this.state.boardTitle === '' || $('#summernote').summernote('code') === '<p><br></p>') {
            alert('게시글 제목과 내용을 입력해주세요');
            return;
        }

        if (this.props.status === 'write') {
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
                        this.props.writeComplete(data.maxBoardNo, this.state.boardTitle, this.state.boardAuthor);
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                });
        } else if (this.props.status === 'update') {
            fetch(`UpdateBoard`, {
                method: 'post',
                body: JSON.stringify({
                    BOARDNO: this.props.boardDetail.boardNo,
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
                        this.props.updateComplete(this.props.boardDetail.boardNo);
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                });
        }

        
    }

    handleMoveList = () => {
        this.props.moveList();
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
                                    style={{ width: "992px" }}
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
                            <td>
                                <div id="summernote" dangerouslySetInnerHTML={{ __html: this.state.boardContents }}>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <button onClick={this.handleSubmit}>작성완료</button>
                &nbsp;&nbsp;
                <button onClick={this.handleMoveList}>취소</button>
            </React.Fragment>
        );
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default BoardWrite;
