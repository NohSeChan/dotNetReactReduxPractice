import { Action, Reducer } from 'redux';


export interface BoardReplyState {
    replyReply: number,
    replyReplyInput: string,
}

export interface HandleReplyModeTransferAction {
    type: 'boardReply/ReplyModeTransfer',
    meta: {
        replyReply: number,
        replyReplyInput: string,
    }
}
export interface HandleOnChangeAction {
    type: 'boardReply/OnChange',
    meta: {
        targetName: string,
        targetValue: string
    }
}
type KnownAction = HandleReplyModeTransferAction | HandleOnChangeAction;

export const actionCreators = {
    handleReplyModeTransfer: (replyReply: number, replyReplyInput: string) => ({
        type: 'boardReply/ReplyModeTransfer',
        meta: {
            replyReply,
            replyReplyInput,
        }
    }),
    handleOnChange: (targetName: string, targetValue: string) => ({
        type: 'boardReply/OnChange',
        meta: {
            targetName,
            targetValue
        }
    })
};

export const reducer: Reducer<BoardReplyState> = (state: BoardReplyState | undefined, incomingAction: Action): BoardReplyState => {
    if (state === undefined) {
        return {
            replyReply: 0,
            replyReplyInput: '',
        }
    };
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'boardReply/ReplyModeTransfer':
            return {
                ...state,
                replyReply: action.meta.replyReply,
                replyReplyInput: action.meta.replyReplyInput,
            };
        case 'boardReply/OnChange':
            return {
                ...state,
                [action.meta.targetName]: action.meta.targetValue
            }
        default:
            return state;
    }
};
