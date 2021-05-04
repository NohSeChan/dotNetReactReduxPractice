import { Action, Reducer } from 'redux';

interface ReplyType {
    replyId: number;
    replyNo: number;
    replyContents: string;
    replyCreateTime: string;
    boardreplyusername: string;
    p_REPLYID: number;
}

export interface BoardContentsState {
    showUpdateDeleteBtn: boolean,
    replyList: ReplyType[],
    replyInput: '',
    isLogin: boolean,
}

export interface HandleShowUpdateDeleteBtnAction {
    type: 'boardContents/ShowUpdateDeleteBtn',
    meta: {
        showUpdateDeleteBtn: boolean
    }
}
export interface HandleIsLoginAction {
    type: 'boardContents/IsLogin',
    meta: {
        isLogin: boolean
    }
}
export interface HandleReplyListAction {
    type: 'boardContents/ReplyList',
    payload: []
}
export interface HandleOnChangeAction {
    type: 'boardContents/OnChange',
    meta: {
        e: React.FormEvent<HTMLInputElement>
    }
}
export interface HandleReplyEmptyInputAction {
    type: 'boardContents/ReplyInputEmpty',
}
type KnownAction = HandleShowUpdateDeleteBtnAction | HandleIsLoginAction | HandleReplyListAction | HandleOnChangeAction | HandleReplyEmptyInputAction;

export const actionCreators = {
    handleShowUpdateDeleteBtn: (showUpdateDeleteBtn: boolean) => ({
        type: 'boardContents/ShowUpdateDeleteBtn',
        meta: {
            showUpdateDeleteBtn
        }
    }),
    handleIsLogin: (isLogin: boolean) => ({
        type: 'boardContents/IsLogin',
        meta: {
            isLogin
        }
    }),
    handleReplyList: (boardReply: []) => ({
        type: 'boardContents/ReplyList',
        payload: boardReply
    }),
    handleOnChange: (e: React.FormEvent<HTMLInputElement>) => ({
        type: 'boardContents/OnChange',
        meta: {
            e
        }
    }),
    handleReplyInputEmpty: () => ({
        type: 'boardContents/ReplyInputEmpty'
    })
};



export const reducer: Reducer<BoardContentsState> = (state: BoardContentsState | undefined, incomingAction: Action): BoardContentsState => {
    if (state === undefined) {
        return {
            showUpdateDeleteBtn: false,
            replyList: [],
            replyInput: '',
            isLogin: false,
        }
    };
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'boardContents/ShowUpdateDeleteBtn':
            return {
                ...state,
                showUpdateDeleteBtn: action.meta.showUpdateDeleteBtn
            };
        case 'boardContents/IsLogin':
            return {
                ...state,
                isLogin: action.meta.isLogin
            }
        case 'boardContents/ReplyList':
            return {
                ...state,
                replyList: action.payload
            }
        case 'boardContents/OnChange':
            return {
                ...state,
                [action.meta.e.currentTarget.name]: action.meta.e.currentTarget.value
            }
        case 'boardContents/ReplyInputEmpty':
            return {
                ...state,
                replyInput: ''
            }
        default:
            return state;
    }
};
