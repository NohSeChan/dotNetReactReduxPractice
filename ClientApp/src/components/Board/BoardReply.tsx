import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

interface ReplyType {
    replyId: number;
    replyNo: number;
    replyContents: string;
    replyCreateTime: string;
    boardreplyusername: string;
    replyreply: string;
}

interface Props {
    replyList: ReplyType[];
}

class BoardReply extends Component<Props> {
    handleReplyModeTransfer = () => {

    }

    public render() {
        const _replyList = this.props.replyList.map((v1) => (
            v1.replyreply === 'N'
                // 답글이면
                ? (
                    <div key={ v1.replyId}>
                        <hr style={{color: '#000000',backgroundColor: '#000000',borderColor : '#000000'}} />
                        <li style={{ listStyle: 'none'}}>
                            {v1.replyContents} <a href="#" onClick={this.handleReplyModeTransfer}> - [답글달기]</a><span style={{ float: "right", paddingRight: "30px", color: "gray" }}>by.{v1.boardreplyusername} - {v1.replyCreateTime.substr(0,10)}</span>
                        </li>
                    </div>
                )
                // 답글의 답글이면
                : (
                    <li style={{ listStyle: 'none' }} key={v1.replyId}>
                        &nbsp;&nbsp;▶ {v1.replyContents}<span style={{ float: "right", paddingRight: "30px", color: "gray" }}>by.{v1.boardreplyusername} - {v1.replyCreateTime.substr(0, 10)}</span>
                    </li>    
                )
        ));

        return (
            <div>
                <ul>
                    {_replyList}
                </ul>
            </div>
        );
    };
}

export default BoardReply;
