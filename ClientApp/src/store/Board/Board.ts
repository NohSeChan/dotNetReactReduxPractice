import { Action, Reducer } from 'redux';


interface BoardListState {
    boardno: number,
    boardtitle: string,
    boardauthor: string,
    boardview: number,
    replycount: number,
}

export interface BoardDetailState {
    boardno?: number,
    boardtitle: string,
    boardauthor?: string,
    boardview?: number,
    boardcontents: string,
    creatE_DATETIME?: string,
    boarduserid?: string,
}

export interface BoardState {
    boardList: BoardListState[],
    status: string,
    isLogin: boolean,
    boardDetail: BoardDetailState,
    filterKeyTitle: string,
    filterKeyAuthor: string,
}

export interface HandleIsLoginAction {
    type: 'board/IsLogin',
    meta: {
        isLogin: boolean
    }
}
export interface HandleBoardListAction {
    type: 'board/BoardList',
    payload: BoardListState[]
}
export interface HandleWriteToggleAction {
    type: 'board/WriteToggle',
}
export interface HandleReadToggleAction {
    type: 'board/ReadToggle',
}
export interface HandleReadDetailToggleAction {
    type: 'board/ReadDetailToggle',
    payload: BoardDetailState
}
export interface HandleUpdateToggleAction {
    type: 'board/UpdateToggle',
}
export interface HandleOnChangeAction {
    type: 'board/OnChange',
    meta: {
        targetName: string,
        targetValue: string
    }
}
export interface HandleResetBoardListAction {
    type: 'board/ResetBoardList'
}
type KnownAction = HandleIsLoginAction | HandleBoardListAction | HandleWriteToggleAction | HandleReadToggleAction | HandleReadDetailToggleAction | HandleUpdateToggleAction | HandleOnChangeAction | HandleResetBoardListAction;

export const actionCreators = {
    handleIsLogin: (isLogin: boolean) => ({
        type: 'board/IsLogin',
        meta: {
            isLogin
        }
    } as HandleIsLoginAction),
    handleBoardList: (boardList: BoardListState) => ({
        type: 'board/BoardList',
        payload: boardList
    }),
    handleWriteToggle: () => ({
        type: 'board/WriteToggle'
    }),
    handleReadToggle: () => ({
        type: 'board/ReadToggle'
    }),
    handleReadDetailToggle: (boardDetail: BoardDetailState) => ({
        type: 'board/ReadDetailToggle',
        payload: boardDetail
    }),
    handleUpdateToggle: () => ({
        type: 'board/UpdateToggle'
    }),
    handleOnChange: (targetName: string, targetValue: string) => ({
        type: 'board/OnChange',
        meta: {
            targetName,
            targetValue
        }
    }),
    handleResetBoardList: () => ({
        type: 'board/ResetBoardList'
    })
};



export const reducer: Reducer<BoardState> = (state: BoardState | undefined, incomingAction: Action): BoardState => {
    if (state === undefined) {
        return {
            boardList: [
                {
                    boardno: 0,
                    boardtitle: '',
                    boardauthor: '',
                    boardview: 0,
                    replycount: 0,
                }
            ],
            status: 'read',
            isLogin: false,
            boardDetail: {
                boardno: 0,
                boardtitle: '',
                boardauthor: '',
                boardview: 0,
                boardcontents: '',
                creatE_DATETIME: '',
                boarduserid: '',
            },
            filterKeyTitle: '',
            filterKeyAuthor: '',
        }
    };
    

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'board/IsLogin':
            return {
                ...state,
                isLogin: action.meta.isLogin
            };
        case 'board/BoardList':
            return {
                ...state,
                boardList: action.payload
            }
        case 'board/WriteToggle':
            return {
                ...state,
                status: 'write',
                boardDetail: {
                    boardtitle: '',
                    boardcontents: '',
                }
            }
        case 'board/ReadToggle':
            return {
                ...state,
                status: 'read',
            }
        case 'board/ReadDetailToggle':
            return {
                ...state,
                status: 'readDetail',
                boardDetail: {
                    boardno: action.payload.boardno,
                    boardtitle: action.payload.boardtitle,
                    boardauthor: action.payload.boardauthor,
                    boardview: action.payload.boardview,
                    boardcontents: action.payload.boardcontents,
                    creatE_DATETIME: action.payload.creatE_DATETIME,
                    boarduserid: action.payload.boarduserid
                }
            }
        case 'board/UpdateToggle':
            return {
                ...state,
                status: 'update',
            }
        case 'board/OnChange':
            return {
                ...state,
                [action.meta.targetName]: action.meta.targetValue
            }
        case 'board/ResetBoardList':
            return {
                boardList: [
                    {
                        boardno: 0,
                        boardtitle: '',
                        boardauthor: '',
                        boardview: 0,
                        replycount: 0,
                    }
                ],
                status: 'read',
                isLogin: false,
                boardDetail: {
                    boardno: 0,
                    boardtitle: '',
                    boardauthor: '',
                    boardview: 0,
                    boardcontents: '',
                    creatE_DATETIME: '',
                    boarduserid: '',
                },
                filterKeyTitle: '',
                filterKeyAuthor: '',
            }
        default:
            return state;
    }
};
