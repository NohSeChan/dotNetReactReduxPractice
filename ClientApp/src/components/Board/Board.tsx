import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import BoardList from './BoardList';

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

class Board extends Component {
    state = {
        boardList: [
            {
                boardno: 0,
                boardtitle: '',
                boardauthor: '',
                boardview: 0,
            }
        ],
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
            })
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
                    {/*<BoardList list={this.state.boardList} />*/}
                </Table>
            </React.Fragment>


        );
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default Board;
