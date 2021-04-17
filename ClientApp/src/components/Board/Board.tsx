import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardContents from './BoardContents';

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
            boardCreateDateTime: ''
        }
    }

    componentDidMount() {
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

    componentDidUpdate(prevProps: any, prevState: any) {
        // 작성중에 게시판을 다시 눌렀을때
        if (this.state.status !== 'read' && prevState.status !== 'read') {
            this.setState({
                status: 'read'
            });
        }
    }

    handleWriteToggle = () => {
        if (this.state.isLogin) {
            this.setState({
                status: 'write'
            })
        } else {
            alert('로그인을 해주세요');
        };
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
                            boardCreateDateTime: data.boardDetail.creatE_DATETIME
                        }
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
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
                            ? <Link to='/board/write'><button type="button" onClick={this.handleWriteToggle}>작성</button></Link>
                            : <Link to='/login'><button type="button" onClick={this.handleWriteToggle}>작성</button></Link>
                    }
                </React.Fragment>
            );
        } else if (this.state.status === 'write') {
            return (
                <React.Fragment>
                </React.Fragment>
            );
        } else if (this.state.status === 'readDetail') {
            return (
                <React.Fragment>
                    <h1>기본 게시판 구현</h1>
                    <BoardContents
                        boardNo={this.state.boardDetail.boardNo}
                        boardTitle={this.state.boardDetail.boardTitle}
                        boardAuthor={this.state.boardDetail.boardAuthor}
                        boardView={this.state.boardDetail.boardView}
                        boardContents={this.state.boardDetail.boardContents}
                        boardCreateDateTime={this.state.boardDetail.boardCreateDateTime}
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
