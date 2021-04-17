import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';


interface Props {
    boardNo: number;
    boardTitle: string;
    boardAuthor: string;
    boardView: number;
    boardContents: string;
    boardCreateDateTime: string;
}

class BoardContents extends Component<Props> {
    state = {
    }

    componentDidMount() {
    }

    

    public render() {
        return (
            <div>
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
                </Table>
                
                <Link to='/board'><button type="button">목록</button></Link>
            </div>
            );
    };
}

export default BoardContents;
