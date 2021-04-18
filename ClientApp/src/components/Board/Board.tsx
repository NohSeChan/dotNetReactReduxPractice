import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardContents from './BoardContents';
import BoardWrite from './BoardWrite';

//type BoardProps =
//    CounterStore.CounterState &
//    typeof CounterStore.actionCreators &
//    RouteComponentProps<{}>;


interface listType {
    boardNo: number;
    boardTitle: string;
    boardAuthor: string;
    boardView: number;
}

class Board extends Component<any> {
    state = {
        boardList: [
            {
                boardno: 0,
                boardtitle: '',
                boardauthor: '',
                boardview: 0,
            }
        ],
        status: 'read',
        isLogin: false,
        boardDetail: {
            boardNo: 0,
            boardTitle: '',
            boardAuthor: '',
            boardView: 0,
            boardContents: '',
            boardCreateDateTime: '',
            boardUserId: '',
        }
    }

    componentDidMount() {
        this.getBoardList();

        var myCookie = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
        if (myCookie && myCookie[2] !== "" && !this.state.isLogin) {
            this.setState({
                isLogin: true
            });
        } else {
            this.setState({
                isLogin: false
            });
        }
    }


    getBoardList = () => {
        fetch(`BoardList`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    this.setState({
                        boardList: data.boardList
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    componentDidUpdate(prevProps: any, prevState: any) {
    }

    handleWriteToggle = () => {
        if (this.state.isLogin) {
            this.setState({
                status: 'write',
                boardDetail: {
                    boardTitle: '',
                    boardContents: '',
                }
            })
        } else {
            alert('로그인을 해주세요');
        };
    }

    handleWriteComplete = (maxBoardNo: number, boardTitle: string, boardAuthor: string) => {
        let newBoard = {
            boardno: maxBoardNo,
            boardtitle: boardTitle,
            boardauthor: boardAuthor,
            boardview: 0
        }

        this.setState({
            status: 'read',
            boardList: [newBoard, ...this.state.boardList]
        });
    }

    handleReadContents = (boardno: number) => {
        fetch(`BoardDetail?boardNo=${boardno}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    this.setState({
                        status: 'readDetail',
                        boardDetail: { 
                            boardNo: data.boardDetail.boardno,
                            boardTitle: data.boardDetail.boardtitle,
                            boardAuthor: data.boardDetail.boardauthor,
                            boardView: data.boardDetail.boardview,
                            boardContents: data.boardDetail.boardcontents,
                            boardCreateDateTime: data.boardDetail.creatE_DATETIME,
                            boardUserId: data.boardDetail.boarduserid
                        }
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    handleMoveList = () => {
        this.setState({
            status: 'read'
        });

        this.getBoardList();
    }

    handleUpdateTransform = () => {
        this.setState({
            status: 'update'
        });
    }

    handleDeleteComplete = (boardNo: number) => {
        this.setState({
            status: 'read',
            boardList: this.state.boardList.filter(board => board.boardno !== boardNo)
        });
    }

    public render() {
        const list = this.state.boardList.map(v => (
            <tr key={v.boardno}>
                <td>{v.boardno}</td>
                <td>
                    <a href="#" onClick={(e: any) => {
                        e.preventDefault();
                        this.handleReadContents(v.boardno);
                    }}>
                        {v.boardtitle}
                    </a>
                </td>
                <td>{v.boardauthor}</td>
                <td>{v.boardview}</td>
            </tr>
        ));

        if (this.state.status === 'read') {
            return (
                <React.Fragment>
                    <h1>기본 게시판 구현</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </Table>
                    <br />
                    {
                        this.state.isLogin
                            ? <button type="button" onClick={this.handleWriteToggle}>작성</button>
                            : <Link to='/login'><button type="button" onClick={this.handleWriteToggle}>작성</button></Link>
                    }
                </React.Fragment>
            );
        } else if (this.state.status === 'write' || this.state.status === 'update') {
            return (
                <React.Fragment>
                    <BoardWrite
                        writeComplete={this.handleWriteComplete}
                        moveList={this.handleMoveList}
                        boardDetail={this.state.boardDetail}
                        status={this.state.status}
                        updateComplete={this.handleReadContents}
                    />
                </React.Fragment>
            );
        } else if (this.state.status === 'readDetail') {
            return (
                <React.Fragment>
                    <BoardContents
                        boardNo={this.state.boardDetail.boardNo}
                        boardTitle={this.state.boardDetail.boardTitle}
                        boardAuthor={this.state.boardDetail.boardAuthor}
                        boardView={this.state.boardDetail.boardView}
                        boardContents={this.state.boardDetail.boardContents}
                        boardCreateDateTime={this.state.boardDetail.boardCreateDateTime}
                        boardUserId={this.state.boardDetail.boardUserId}
                        moveList={this.handleMoveList}
                        updateTransform={this.handleUpdateTransform}
                        deleteComplete={this.handleDeleteComplete}
                    />
                </React.Fragment>
            );
        }
        //boardDetail: {
        //    boardno: data.boardDetail.boardno,
        //        boardTitle: data.boardDetail.boardtitle,
        //            boardauthor: data.boardDetail.boardauthor,
        //                boardview: data.boardDetail.boardview,
        //                    boardCreateDateTime: data.boardDetail.creatE_DATETIME
        //}
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default Board;
