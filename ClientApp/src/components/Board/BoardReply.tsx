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
    replyReplyNo: number;
    replyReplyContents: string;
    replyReplyCreateTime: string;
}

interface Props {
    replyList: ReplyType[];
}

class BoardReply extends Component<Props> {
    handleReplyModeTransfer = () => {

    }

    public render() {
        const _replyList = this.props.replyList.map((v1) => (
            v1.replyReplyNo === 0
                // 답글이면
                ? (
                    <li style={{ listStyle: 'none'}} key={v1.replyId}>
                        {v1.replyContents} <a href="#" onClick={this.handleReplyModeTransfer}> - [답글달기]</a><span style={{ float: "right", paddingRight: "30px", color: "gray" }}>{v1.replyCreateTime.substr(0,10)}</span>
                    </li>
                )
                // 답글의 답글이면
                : (
                    <li style={{ listStyle: 'none' }} key={v1.replyId}>
                        &nbsp;&nbsp;▶ {v1.replyReplyContents}<span style={{ float: "right", paddingRight: "30px", color: "gray" }}>{v1.replyReplyCreateTime.substr(0, 10)}</span>
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
