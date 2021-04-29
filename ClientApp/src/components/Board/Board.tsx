import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardContents from './BoardContents';
import BoardWrite from './BoardWrite';
import 'bootstrap';
import $ from "jquery";

import NavMenu  from '../NavMenu';

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
                replycount: 0,
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
        },
        filterKeyTitle: '',
        filterKeyAuthor: '',
    }

    componentDidMount() {
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

        this.getBoardList();
    }

    componentWillUnmount = () => {
        if ($('#modalBoxWrite').length === 1) {
            $('#modalBoxWrite').modal('hide');
        } 

        if ($('#modalBoxRead').length === 1) {
            $('#modalBoxRead').modal('hide');
        } 
    }

    //shouldComponentUpdate(nextProps: any, nextState: any) {
    //    console.log('this.state', this.state);
    //    console.log('nextState', nextState);
    //    return true;
    //}


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


    handleWriteToggle = () => {
        this.setState({
            status: 'write',
            boardDetail: {
                boardTitle: '',
                boardContents: '',
            }
        })
    }


    moveLoginPage = () => {
        document.getElementById('boardLink')!.className = "nav-link";
        document.getElementById('loginLink')!.className = "nav-link active";

        alert('로그인을 해주세요');
    }

    handleWriteComplete = async () => {
        $('#modalBoxWrite').modal('hide');
        await this.setState({
            status: 'read',
        });
        await this.getBoardList();
    }


    handleReadContents = async (boardno: number) => {
        if ($('#modalBoxWrite').length === 1) {
            await $('#modalBoxWrite').modal('hide');
        } 

        await fetch(`BoardDetail?boardNo=${boardno}`)
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
        $('#modalBoxRead').modal('show');
    }

    handleMoveList = async () => {
        await $('#modalBoxRead').modal('hide');
        await $('#modalBoxWrite').modal('hide');

        await this.setState({
            status: 'read'
        });

        this.getBoardList();
    }

    handleUpdateTransform = async () => {
        await $('#modalBoxRead').modal('hide');
        await this.setState({
            status: 'update'
        });
        $('#modalBoxWrite').modal('show');
    }

    handleDeleteComplete = (boardNo: number) => {
        this.setState({
            status: 'read',
            boardList: this.state.boardList.filter(board => board.boardno !== boardNo)
        });
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    handleOpenWriteModal = async () => {
        await this.handleWriteToggle();
        $('#modalBoxWrite').modal('show');
    }

    public render() {
        const filterList = this.state.boardList.filter(v => v.boardtitle.includes(this.state.filterKeyTitle) && v.boardauthor.includes(this.state.filterKeyAuthor));

        const list = filterList.map(v => (
            <tr key={v.boardno}>
                <td>{v.boardno}</td>
                <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); this.handleReadContents(v.boardno); }}>
                         {v.boardtitle} [{v.replycount}]
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
                    <input name="filterKeyTitle" className="form-control" style={{ display: 'inline', width: '180px' }} onChange={this.onChange} value={this.state.filterKeyTitle} placeholder="제목 검색" />
                    &nbsp;
                    <input name="filterKeyAuthor" className="form-control" style={{ display: 'inline', width: '180px' }}  onChange={this.onChange} value={this.state.filterKeyAuthor} placeholder="작성자 검색" />
                    <Table style={{ marginTop: "10px" }}>
                        <thead className="thead-dark">
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
                            ? <button type="button" className="btn btn-sm btn-primary" onClick={this.handleOpenWriteModal}>작성</button>
                            : <Link to='/login'><button type="button" className="btn btn-sm btn-primary" onClick={this.moveLoginPage}>작성</button></Link>
                    }
                    
                </React.Fragment>
            );
        } else if (this.state.status === 'write' || this.state.status === 'update') {
            return (
                <React.Fragment>
                    <div id="modalBoxWrite" className="modal" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-lg" role="document" >
                            <div className="modal-content">
                                <BoardWrite
                                    writeComplete={this.handleWriteComplete}
                                    moveList={this.handleMoveList}
                                    boardDetail={this.state.boardDetail}
                                    status={this.state.status}
                                    updateComplete={this.handleReadContents}
                                />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        } else if (this.state.status === 'readDetail') {
            return (
                <React.Fragment>
                    <div id="modalBoxRead" className="modal" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-lg" role="document" >
                            <div className="modal-content">
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
                                    //history={this.props.history}
                                />
                            </div>
                        </div>
                    </div>
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
