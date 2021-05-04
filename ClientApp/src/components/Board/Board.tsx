import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as BoardStore from '../../store/Board/Board';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardContents from './BoardContents';
import BoardWrite from './BoardWrite';
import 'bootstrap';
import $ from "jquery";


type BoardProps =
    BoardStore.BoardState &
    typeof BoardStore.actionCreators &
    RouteComponentProps<{}>;



class Board extends Component<BoardProps> {
    //state = {
    //    boardList: [
    //        {
    //            boardno: 0,
    //            boardtitle: '',
    //            boardauthor: '',
    //            boardview: 0,
    //            replycount: 0,
    //        }
    //    ],
    //    status: 'read',
    //    isLogin: false,
    //    boardDetail: {
    //        boardNo: 0,
    //        boardTitle: '',
    //        boardAuthor: '',
    //        boardView: 0,
    //        boardContents: '',
    //        boardCreateDateTime: '',
    //        boardUserId: '',
    //    },
    //    filterKeyTitle: '',
    //    filterKeyAuthor: '',
    //}

    componentDidMount() {
        var myCookie = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
        if (myCookie && myCookie[2] !== "" && !this.props.isLogin) {
            this.props.handleIsLogin(true);
        } else {
            this.props.handleIsLogin(false);
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
    //    console.log('this.props', this.props);
    //    console.log('nextState', nextState);
    //    return true;
    //}


    getBoardList = () => {
        fetch(`BoardList`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    this.props.handleBoardList(data.boardList)
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }


    handleWriteToggle = () => {
        this.props.handleWriteToggle();
    }


    moveLoginPage = () => {
        document.getElementById('boardLink')!.className = "nav-link";
        document.getElementById('loginLink')!.className = "nav-link active";

        alert('로그인을 해주세요');
    }

    handleWriteComplete = async () => {
        $('#modalBoxWrite').modal('hide');
        await this.props.handleReadToggle();
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
                    this.props.handleReadDetailToggle(data.boardDetail)
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
        $('#modalBoxRead').modal('show');
    }

    handleMoveList = async () => {
        await $('#modalBoxRead').modal('hide');
        await $('#modalBoxWrite').modal('hide');

        await this.props.handleReadToggle();


        this.getBoardList();
    }

    handleUpdateTransform = async () => {
        await $('#modalBoxRead').modal('hide');
        await this.props.handleUpdateToggle();
        $('#modalBoxWrite').modal('show');
    }

    handleDeleteComplete = async () => {
        await this.props.handleReadToggle();
        this.getBoardList();
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.handleOnChange(e);
    }

    handleOpenWriteModal = async () => {
        await this.handleWriteToggle();
        $('#modalBoxWrite').modal('show');
    }

    public render() {
        const filterList = this.props.boardList.filter(v => v.boardtitle.includes(this.props.filterKeyTitle) && v.boardauthor.includes(this.props.filterKeyAuthor));

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
        if (this.props.status === 'read') {
            return (
                <React.Fragment>
                    <h1>기본 게시판 구현</h1>
                    <input name="filterKeyTitle" className="form-control" style={{ display: 'inline', width: '180px' }} onChange={this.onChange} value={this.props.filterKeyTitle} placeholder="제목 검색" />
                    &nbsp;
                    <input name="filterKeyAuthor" className="form-control" style={{ display: 'inline', width: '180px' }}  onChange={this.onChange} value={this.props.filterKeyAuthor} placeholder="작성자 검색" />
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
                        this.props.isLogin
                            ? <button type="button" className="btn btn-sm btn-primary" onClick={this.handleOpenWriteModal}>작성</button>
                            : <Link to='/login'><button type="button" className="btn btn-sm btn-primary" onClick={this.moveLoginPage}>작성</button></Link>
                    }
                    
                </React.Fragment>
            );
        } else if (this.props.status === 'write' || this.props.status === 'update') {
            return (
                <React.Fragment>
                    <div id="modalBoxWrite" className="modal" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-lg" role="document" >
                            <div className="modal-content">
                                <BoardWrite
                                    writeComplete={this.handleWriteComplete}
                                    moveList={this.handleMoveList}
                                    boardDetail={this.props.boardDetail}
                                    status={this.props.status}
                                    updateComplete={this.handleReadContents}
                                />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        } else if (this.props.status === 'readDetail') {
            return (
                <React.Fragment>
                    <div id="modalBoxRead" className="modal" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div className="modal-dialog modal-lg" role="document" >
                            <div className="modal-content">
                                <BoardContents
                                    boardNo={this.props.boardDetail.boardno!}
                                    boardTitle={this.props.boardDetail.boardtitle!}
                                    boardAuthor={this.props.boardDetail.boardauthor!}
                                    boardView={this.props.boardDetail.boardview!}
                                    boardContents={this.props.boardDetail.boardcontents!}
                                    boardCreateDateTime={this.props.boardDetail.creatE_DATETIME!}
                                    boardUserId={this.props.boardDetail.boarduserid!}
                                    moveList={this.handleMoveList}
                                    updateTransform={this.handleUpdateTransform}
                                />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state: ApplicationState) => state.board,
    BoardStore.actionCreators
)(Board);
