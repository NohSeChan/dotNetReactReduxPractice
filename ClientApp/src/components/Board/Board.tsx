import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

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
        if (this.state.status === 'write' && prevState.status === 'write') {
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


    public render() {
        const list = this.state.boardList.map(v => (
            <tr key={v.boardno}>
                <td>{v.boardno}</td>
                <td>{v.boardtitle}</td>
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
        }

        
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default Board;
