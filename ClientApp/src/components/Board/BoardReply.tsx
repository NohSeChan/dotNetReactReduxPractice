import React, { Component, createRef } from 'react';
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
    p_REPLYID: number;
}

interface Props {
    replyList: ReplyType[];
    boardNo: number;
    isLogin: boolean;
    draw: () => void;
}

class BoardReply extends Component<Props> {
    state = {
        replyReply: 0,
        replyReplyInput: '',
    }

    replyInputRef1 = createRef<HTMLInputElement>(); 
    replyInputRef2 = createRef<HTMLInputElement>();

    componentDidUpdate() {
        this.replyInputRef1.current && this.replyInputRef1.current.focus();
        this.replyInputRef2.current && this.replyInputRef2.current.focus();
    }

    handleReplyModeTransfer = (e: any, replyId: number) => {
        e.preventDefault();
        if (replyId !== this.state.replyReply) {
            this.setState({
                replyReply: replyId,
                replyReplyInput: '',
            });
        } else if (replyId === this.state.replyReply) {
            this.setState({
                replyReply: 0,
                replyReplyInput: '',
            });
        }
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    handleSubmitReplyReply = () => {
        if (!this.props.isLogin) {
            alert('댓글 기능은 로그인 사용자만 이용가능합니다.');
        } else {
            fetch('WriteBoardReplyReply', {
                method: 'post',
                body: JSON.stringify({
                    boardNo: this.props.boardNo,
                    ReplyContents: this.state.replyReplyInput,
                    P_REPLYID: this.state.replyReply
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.setState({
                            replyReplyInput: '',
                            replyReply: 0
                        });
                        this.props.draw();
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                })
        }
    }

    handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            this.handleSubmitReplyReply();
        }
    };

    
    public render() {
        const lastIndex = this.props.replyList.map((v) => {
            if (v.p_REPLYID === this.state.replyReply) {
                return v.replyId;
            } else {
                return 0
            }
                
        });
        var inputReplyIndex = Math.max.apply(null, lastIndex);
        const _replyList = this.props.replyList.map((v1) => (
            v1.replyId === v1.p_REPLYID
                // 답글이면
                ? (
                    <div key={v1.replyId}>
                        <hr style={{ color: '#000000', backgroundColor: '#000000', borderColor: '#000000' }} />
                        <li style={{ listStyle: 'none' }}>
                            <span style={{ color: "gray" }}>by.{v1.boardreplyusername} : </span>{v1.replyContents} <a href="#" onClick={(e) => this.handleReplyModeTransfer(e, v1.replyId)}> - [답글달기]</a><span style={{ float: "right", paddingRight: "30px", color: "gray" }}>{v1.replyCreateTime.substr(0, 10)}</span>
                        </li>
                        {inputReplyIndex === v1.replyId ? <div><input type="type" style={{ width: "880px" }} name="replyReplyInput" onChange={this.onChange} value={this.state.replyReplyInput} placeholder="답글작성" onKeyPress={this.handleKeyPress} ref={this.replyInputRef1} />&nbsp;&nbsp;<button className="btn btn-sm btn-secondary" onClick={this.handleSubmitReplyReply}>등록</button></div> : null}
                    </div>
                )
                // 답글의 답글이면
                : (
                    <div key={v1.replyId}>
                        <li style={{ listStyle: 'none' }}>
                            &nbsp;&nbsp;▶<span style={{ color: "gray" }}>by.{v1.boardreplyusername} : </span> {v1.replyContents}<span style={{ float: "right", paddingRight: "30px", color: "gray" }}>{v1.replyCreateTime.substr(0, 10)}</span>
                        </li>
                        {inputReplyIndex === v1.replyId ? <div><input type="type" style={{ width: "880px" }} name="replyReplyInput" onChange={this.onChange} value={this.state.replyReplyInput} placeholder="답글작성" onKeyPress={this.handleKeyPress} ref={this.replyInputRef2} />&nbsp;&nbsp;<button className="btn btn-sm btn-secondary" onClick={this.handleSubmitReplyReply}>등록</button></div> : null}    
                    </div>
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
