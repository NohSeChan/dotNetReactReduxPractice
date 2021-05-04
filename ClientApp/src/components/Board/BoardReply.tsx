import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardReplyStore from '../../store/Board/BoardReply';

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

type BoardReplyProps =
    BoardReplyStore.BoardReplyState &
    typeof BoardReplyStore.actionCreators
    ;

class BoardReply extends Component<Props & BoardReplyProps> {
    replyInputRef1 = createRef<HTMLInputElement>(); 
    replyInputRef2 = createRef<HTMLInputElement>();

    componentDidUpdate() {
        this.replyInputRef1.current && this.replyInputRef1.current.focus();
        this.replyInputRef2.current && this.replyInputRef2.current.focus();
    }

    handleReplyModeTransfer = (e: any, replyId: number) => {
        e.preventDefault();
        if (replyId !== this.props.replyReply) { // 답글달기 클릭시 세팅
            this.props.handleReplyModeTransfer(replyId, '');
        } else if (replyId === this.props.replyReply) { // 답글달기 중복클릭이면 초기화
            this.props.handleReplyModeTransfer(0, '');
        }
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const targetName = e.currentTarget.name;
        const targetValue = e.currentTarget.value;
        this.props.handleOnChange(targetName, targetValue);
    }

    handleSubmitReplyReply = () => {
        if (!this.props.isLogin) {
            alert('댓글 기능은 로그인 사용자만 이용가능합니다.');
        } else {
            fetch('WriteBoardReplyReply', {
                method: 'post',
                body: JSON.stringify({
                    boardNo: this.props.boardNo,
                    ReplyContents: this.props.replyReplyInput,
                    P_REPLYID: this.props.replyReply
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.props.handleReplyModeTransfer(0, '');
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
            if (v.p_REPLYID === this.props.replyReply) {
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
                            <span style={{ color: "gray" }}>by.{v1.boardreplyusername} : {v1.replyContents} </span>
                            <a href="#" onClick={(e) => this.handleReplyModeTransfer(e, v1.replyId)}> - [답글달기]</a>
                            <span style={{ float: 'right', color: "gray" }}>{v1.replyCreateTime.substr(0, 10)}</span>
                        </li>
                        {inputReplyIndex === v1.replyId
                            ? <span style={{ display: 'block', margin: '4px' }}>
                                <input
                                    style={{ width: "75%" }}
                                    name="replyReplyInput"
                                    onChange={this.onChange}
                                    value={this.props.replyReplyInput}
                                    placeholder="답글작성"
                                    onKeyPress={this.handleKeyPress}
                                    ref={this.replyInputRef1}
                                    maxLength={15} />&nbsp;&nbsp;
                                <button className="btn btn-sm btn-secondary" onClick={this.handleSubmitReplyReply}>등록</button>
                            </span>
                            : null}
                    </div>
                )
                // 답글의 답글이면
                : (
                    <div key={v1.replyId}>
                        <li style={{ listStyle: 'none' }}>
                            &nbsp;&nbsp;▶<span style={{ color: "gray" }}>by.{v1.boardreplyusername} :  {v1.replyContents}</span>
                            <span style={{ float: 'right', color: "gray" }}>{v1.replyCreateTime.substr(0, 10)}</span>
                        </li>
                        {inputReplyIndex === v1.replyId
                            ? <span style={{ display: 'block', margin: '4px' }}>
                                <input
                                    style={{ width: "75%" }}
                                    name="replyReplyInput"
                                    onChange={this.onChange}
                                    value={this.props.replyReplyInput}
                                    placeholder="답글작성"
                                    onKeyPress={this.handleKeyPress}
                                    ref={this.replyInputRef2}
                                    maxLength={15} />&nbsp;&nbsp;
                                <button className="btn btn-sm btn-secondary" onClick={this.handleSubmitReplyReply}>등록</button>
                            </span>
                            : null}    
                    </div>
                )
        ));

        return (
            <div>
                <ul style={{ padding: '10px' }}>
                    {_replyList}
                </ul>
            </div>
        );
    };
}

export default connect(
    (state: ApplicationState) => state.boardReply,
    BoardReplyStore.actionCreators
)(BoardReply);


