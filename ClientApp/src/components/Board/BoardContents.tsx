import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardReply from './BoardReply';


interface Props {
    boardNo: number;
    boardTitle: string;
    boardAuthor: string;
    boardView: number;
    boardContents: string;
    boardCreateDateTime: string;
    boardUserId: string;
    moveList: () => void;
    updateTransform: () => void;
    deleteComplete: (boardNo: number) => void;
}

class BoardContents extends Component<Props> {
    state = {
        showUpdateDeleteBtn: false,
        replyList: [],
        replyInput: ''
    }

    componentDidMount() {
        var myCookie = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
        
        if (this.props.boardUserId === (myCookie && myCookie[2])) {
            this.setState({
                showUpdateDeleteBtn: true
            });
        } else {
            this.setState({
                showUpdateDeleteBtn: false
            });
        }

        fetch(`GetBoardReply?boardNo=${this.props.boardNo}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    this.setState({
                        replyList: data.boardReply
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    handleMoveList = () => {
        this.props.moveList();
    }

    handleUpdate = () => {
        this.props.updateTransform();
    }


    handleRemove = () => {
        if (window.confirm("해당 게시글을 삭제하시겠습니까?")) {
            fetch('DeleteBoard', {
                method: 'post',
                body: JSON.stringify({
                    boardNo: this.props.boardNo,
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.props.deleteComplete(this.props.boardNo);
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                })
        }
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    public render() {
        return (
            <div>
                <h1>기본 게시판 구현</h1>
                <Table>
                    <thead> 
                        <tr>
                            <th>글번호</th>
                            <td colSpan={3}>{this.props.boardNo}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>{this.props.boardTitle}</td>
                            <th>작성일</th>
                            <td>{this.props.boardCreateDateTime.substr(0, 10)}</td>
                        </tr>
                        <tr>
                            <th>글쓴이</th>
                            <td>{this.props.boardAuthor}</td>
                            <th>조회수</th>
                            <td>{this.props.boardView}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ height: "600px"}}>
                            <th>내용</th>
                            <td colSpan={3}>
                                <div dangerouslySetInnerHTML={{ __html: this.props.boardContents  }} />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>댓글</th>
                            <td colSpan={3}>
                                <BoardReply
                                    replyList={this.state.replyList}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>댓글작성</th>
                            <td colSpan={3}>
                                <input name="replyInput" value={this.state.replyInput} onChange={this.onChange} style={{ width: "840px" }} placeholder="댓글작성" maxLength={50} /> &nbsp;
                                <button>등록</button>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
                
                <button onClick={this.handleMoveList}>목록</button>
                {this.state.showUpdateDeleteBtn
                    ? <>&nbsp;<button onClick={this.handleUpdate}>수정</button>&nbsp;<button onClick={this.handleRemove}>삭제</button></>
                    : null
                }
            </div>
            );
    };
}

export default BoardContents;
