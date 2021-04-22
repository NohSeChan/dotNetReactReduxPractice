import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';
import * as utils from '../../utils/util';
import $ from "jquery";
import 'summernote';
import 'summernote/dist/lang/summernote-ko-KR';
import 'summernote/dist/summernote.css';
import 'bootstrap';
import { Table } from 'reactstrap';
import { History } from 'history';

//type BoardProps =
//    CounterStore.CounterState &
//    typeof CounterStore.actionCreators &
//    RouteComponentProps<{}>;


interface State {
    boardTitle: string;
    boardAuthor: string;
    boardContents: string;
}

interface Props {
/*writeComplete: (maxBoardNo: number, boardTitle: string, boardAuthor: string) => void;*/
    writeComplete: () => void;
    moveList: () => void;
    boardDetail: BoardDetailType;
    status: string;
    updateComplete: (boardNo: number) => void;
    history: History;
}

interface BoardDetailType {
    boardNo: number,
    boardTitle: string,
    boardAuthor: string,
    boardView: number,
    boardContents: string,
    boardCreateDateTime: string,
    boardUserId: string,
}

class BoardWrite extends Component<Props, State> {
    state = {
        boardTitle: this.props.boardDetail.boardTitle ||'',
        boardAuthor: this.props.boardDetail.boardAuthor || '',
        boardContents: this.props.boardDetail.boardContents || '',
    }

    componentDidMount() {
        var myCookie = document.cookie.match('(^|;) ?' + 'userName' + '=([^;]*)(;|$)');
        var userNameAscii = myCookie && myCookie[2] || '';
        this.setState({
            boardAuthor: utils.asciiToStr(userNameAscii.split(','))
        });

        $('#summernote').summernote({
            height: 300,                 // 에디터 높이
            lang:'ko-KR',
            focus: true,                  // 에디터 로딩후 포커스를 맞출지 여부
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


    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const key = e.currentTarget.name;
        if (Object.keys(this.state).includes(key)) {
            this.setState({
                [key]: e.currentTarget.value
            } as Pick<State, keyof State>);
        }
    }

    handleSubmit = () => {
        if (this.state.boardTitle === '' || $('#summernote').summernote('code') === '<p><br></p>') {
            alert('게시글 제목과 내용을 입력해주세요');
            return;
        }

        if (this.props.status === 'write') {
            fetch(`WriteBoard`, {
                method: 'post',
                body: JSON.stringify({
                    BOARDTITLE: this.state.boardTitle,
                    BOARDAUTHOR: this.state.boardAuthor,
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
                        //this.props.writeComplete();
                        this.props.history.push('/board');
                    } else if (data.msg === 'FAIL') {
                        alert(data.exceptionMsg);
                    }
                });
        } else if (this.props.status === 'update') {
            fetch(`UpdateBoard`, {
                method: 'post',
                body: JSON.stringify({
                    BOARDNO: this.props.boardDetail.boardNo,
                    BOARDTITLE: this.state.boardTitle,
                    BOARDAUTHOR: this.state.boardAuthor,
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
                        this.props.updateComplete(this.props.boardDetail.boardNo);
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
                <h1>기본 게시판 구현</h1>
                <br />
                <Table style={{border: "solid 1px"}}>
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
                                    style={{ width: "992px" }}
                                    name="boardTitle"
                                    value={this.state.boardTitle}
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
                                <div id="summernote" dangerouslySetInnerHTML={{ __html: this.state.boardContents }}>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <button className="btn btn-sm btn-primary" onClick={this.handleSubmit}>작성완료</button>
                &nbsp;&nbsp;
                <Link to='/board'><button className="btn btn-sm btn-secondary" onClick={this.handleMoveList}>취소</button></Link>
            </React.Fragment>
        );
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default BoardWrite;
