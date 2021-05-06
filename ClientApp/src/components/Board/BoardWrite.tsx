import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as BoardWriteStore from '../../store/Board/BoardWrite';
import { BoardDetailState } from '../../store/Board/Board';
import * as utils from '../../utils/util';
import $ from "jquery";
import 'summernote';
import 'summernote/dist/lang/summernote-ko-KR';
import 'summernote/dist/summernote.css';
import 'bootstrap';
import { Table } from 'reactstrap';


interface Props {
    writeComplete: () => void;
    moveList: () => void;
    boardDetail: BoardDetailState | undefined;
    status: string;
    updateComplete: (boardNo: number) => void;
}

type BoardWriteProps =
    BoardWriteStore.BoardWriteState &
    typeof BoardWriteStore.actionCreators
    ;


class BoardWrite extends Component<Props & BoardWriteProps> {
    componentDidMount = async () => {
        // update 요청이면
        if (this.props.boardDetail!.boardno !== undefined) {
            await this.props.handleUpdateToggle(this.props.boardDetail!);
        } else {
            var myCookie = document.cookie.match('(^|;) ?' + 'userName' + '=([^;]*)(;|$)');
            var userNameAscii = myCookie && myCookie[2] || '';
            this.props.handleWriteSetBoardAuthor(utils.asciiToStr(userNameAscii.split(',')));
        }

        $('#summernote').summernote({
            height: 300,                // 에디터 높이
            width: '100%',
            lang:'ko-KR',               // 한글 ToolTip
            toolbar: [
                ['fontsize', ['fontsize']],
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline']],
                ['font', ['strikethrough']],
                ['color', ['color']],
                ['para', ['paragraph']],
                ['height', ['height']],
                ['insert', ['table']],
                ['insert', ['picture']],
                ['insert', ['link']],
                ['misc', ['codeview']],
            ],
            placeholder: '게시글을 입력해주세요',
            callbacks: {	//여기 부분이 이미지를 첨부하는 부분
                onImageUpload: function (files: any) {
                    uploadSummernoteImageFile(files[0], this);
                },
                onPaste: function (e: any) {
                    var clipboardData = e.originalEvent.clipboardData;
                    if (clipboardData && clipboardData.items && clipboardData.items.length) {
                        var item = clipboardData.items[0];
                        if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                            e.preventDefault();
                        }
                    }
                }
            }
        });

        /**
        * 이미지 파일 업로드
        */
        const uploadSummernoteImageFile = (file: any, editor: any): void => {
            var data = new FormData();
            data.append("file", file);
            $.ajax({
                data: data,
                type: "POST",
                url: "/uploadSummernoteImageFile",
                enctype: 'multipart/form-data',
                contentType: false,
                processData: false,
                success: function (data) {
                    //항상 업로드된 파일의 url이 있어야 한다.
                    $(editor).summernote('insertImage', data.url);
                    $('#imageBoard > ul').append('<li><img src="' + data.url + '" width="480" height="auto"/></li>');
                }
            });
        }
    }

    componentWillUnmount = () => {
        this.props.handleResetBoardWrite();
    }


    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const targetName = e.currentTarget.name;
        const targetValue = e.currentTarget.value;
        this.props.handleOnChange(targetName, targetValue);
    }

    handleSubmit = () => {
        if (this.props.boardtitle === '' || $('#summernote').summernote('code') === '<p><br></p>') {
            alert('게시글 제목과 내용을 입력해주세요');
            return;
        }
        if (this.props.status === 'write') {
            fetch(`WriteBoard`, {
                method: 'post',
                body: JSON.stringify({
                    BOARDTITLE: this.props.boardtitle,
                    BOARDAUTHOR: this.props.boardauthor,
                    BOARDCONTENTS: $('#summernote').summernote('code')
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.props.writeComplete();
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                });
        } else if (this.props.status === 'update') {
            fetch(`UpdateBoard`, {
                method: 'post',
                body: JSON.stringify({
                    BOARDNO: this.props.boardDetail!.boardno,
                    BOARDTITLE: this.props.boardtitle,
                    BOARDAUTHOR: this.props.boardauthor,
                    BOARDCONTENTS: $('#summernote').summernote('code')
                }),
                headers: {
                    'Accept': 'application/json; charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === 'OK') {
                        this.props.updateComplete(this.props.boardDetail!.boardno!);
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                });
        }

        
    }

    handleMoveList = () => {
        this.props.moveList();
    }

    public render() {
        return (
            <React.Fragment>
                <h1>{ this.props.status === 'write' ? '게시글 작성하기' : '게시글 수정하기' }</h1>
                <br />
                <Table style={{ border: "solid 1px", width: "auto"}}>
                    <colgroup>
                        <col style={{ "width":"90px" }} />
                        <col style={{ "width":"auto" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    style={{ width: "100%" }}
                                    name="boardtitle"
                                    value={this.props.boardtitle}
                                    onChange={this.onChange}
                                    placeholder="제목을 입력해주세요"
                                    maxLength={50}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>내용</th>
                            <td>
                                <div id="summernote" dangerouslySetInnerHTML={{ __html: this.props.boardcontents }}>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <div className="modal-footer">
                    <button className="btn btn-primary" style={{ width: '100px' }} onClick={this.handleSubmit}>{ this.props.status === 'write' ? '작성완료' : '수정완료' }</button>
                    <button className="btn btn-secondary" style={{ width: '80px' }} onClick={this.handleMoveList}>취소</button>
                </div>
                
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.boardWrite,
    BoardWriteStore.actionCreators
)(BoardWrite);
