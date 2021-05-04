import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as BoardContentsStore from '../../store/Board/BoardContents';
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
}

type BoardContentsProps =
    BoardContentsStore.BoardContentsState &
    typeof BoardContentsStore.actionCreators
    ;


class BoardContents extends Component<Props & BoardContentsProps> {
    componentDidMount() {
        var myCookie = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
        
        if (this.props.boardUserId === (myCookie && myCookie[2])) {
            this.props.handleShowUpdateDeleteBtn(true);
        } else {
            this.props.handleShowUpdateDeleteBtn(false);
        }

        this.getBoardReplyList();

        var myCookie = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
        if (myCookie && myCookie[2] !== "" && !this.props.isLogin) {
            this.props.handleIsLogin(true);
        } else {
            this.props.handleIsLogin(false);
        }
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
                        this.handleMoveList();
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                })
        }
    }

    getBoardReplyList = () => {
        fetch(`GetBoardReply?boardNo=${this.props.boardNo}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    this.props.handleReplyList(data.boardReply);
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }


    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const targetName = e.currentTarget.name;
        const targetValue = e.currentTarget.value;
        this.props.handleOnChange(targetName, targetValue);
    }

    handleSubmit = () => {
        if (!this.props.isLogin) {
            alert('댓글 기능은 로그인 사용자만 이용가능합니다.');
        } else {
            fetch('WriteBoardReply', {
                method: 'post',
                body: JSON.stringify({
                    boardNo: this.props.boardNo,
                    ReplyContents: this.props.replyInput
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.getBoardReplyList();
                        this.props.handleReplyInputEmpty();
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                })
        }
    };

    handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div id="tableScrollX"> 
                <h2 style={{ display: 'inline' }}>{this.props.boardTitle} - [by.{this.props.boardAuthor}]</h2><button className="btn btn-sm" style={{ float: 'right', fontSize: '20px' }} onClick={this.handleMoveList} >[X]</button>
                <Table style={{ marginTop: '15px' }} >
                    <colgroup>
                        <col style={{ "width": "199px" }} />
                        <col style={{ "width": "auto" }} />
                        <col style={{ "width": "199px" }} />
                        <col style={{ "width": "200px" }} />
                    </colgroup>
                    <thead> 
                        <tr>
                            <th>작성일</th>
                            <td>{this.props.boardCreateDateTime.substr(0, 10)}</td>
                            <th>조회수</th>
                            <td>{this.props.boardView}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th style={{ verticalAlign: 'middle' }}>내용</th>
                            <td colSpan={3} style={{ height: "450px" }}>
                                <div dangerouslySetInnerHTML={{ __html: this.props.boardContents }} />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>댓글</th>
                            <td colSpan={3}>
                                <BoardReply
                                    replyList={this.props.replyList}
                                    boardNo={this.props.boardNo}
                                    isLogin={this.props.isLogin}
                                    draw={this.getBoardReplyList}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>댓글작성</th>
                            <td colSpan={3}>
                                <span style={{ display: 'block' }}>
                                    <input
                                        name="replyInput"
                                        style={{ width: '67%' }}
                                        value={this.props.replyInput}
                                        onChange={this.onChange}
                                        placeholder="댓글작성"
                                        maxLength={15}
                                        onKeyPress={this.handleKeyPress}
                                    /> &nbsp;
                                    <button type="button" className="btn btn-sm btn-secondary"
                                        onClick={this.handleSubmit}>등록</button>
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
                <br />
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={this.handleMoveList}>
                    목록
                </button>
                {this.props.showUpdateDeleteBtn
                    ? <>&nbsp;
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={this.handleUpdate}>
                            수정
                        </button>&nbsp;
                        <button className="btn btn-sm btn-secondary" onClick={this.handleRemove}>
                            삭제
                        </button>
                    </>
                    : null
                }
            </div>
            );
    };
}

export default connect(
    (state: ApplicationState) => state.boardContents,
    BoardContentsStore.actionCreators
)(BoardContents);
