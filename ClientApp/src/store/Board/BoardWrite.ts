import { Action, Reducer } from 'redux';
import { BoardDetailState } from './Board';

export interface BoardWriteState {
    boardtitle: string;
    boardauthor: string;
    boardcontents: string;
}

export interface HandleUpdateToggleAction {
    type: 'boardWrite/UpdateToggle',
    payload: BoardDetailState
}


export interface HandleWriteSetBoardAuthorAction {
    type: 'boardWrite/WriteSetBoardAuthor',
    meta: {
        boardauthor: string
    }
}
export interface HandleOnChangeAction {
    type: 'boardWrite/OnChange',
    meta: {
        targetName: string,
        targetValue: string
    }
}
export interface HandleResetBoardWriteAction {
    type: 'boardWrite/ResetBoardWrite',
}
type KnownAction = HandleUpdateToggleAction | HandleWriteSetBoardAuthorAction | HandleOnChangeAction | HandleResetBoardWriteAction;

export const actionCreators = {
    handleUpdateToggle: (boardDetail: BoardDetailState) => ({
        type: 'boardWrite/UpdateToggle',
        payload: boardDetail
    }),
    handleWriteSetBoardAuthor: (boardauthor: string) => ({
        type: 'boardWrite/WriteSetBoardAuthor',
        meta: {
            boardauthor
        }
    }),
    handleOnChange: (targetName: string, targetValue: string) => ({
        type: 'boardWrite/OnChange',
        meta: {
            targetName,
            targetValue
        }
    }),
    handleResetBoardWrite: () => ({
        type: 'boardWrite/ResetBoardWrite'
    })
};



export const reducer: Reducer<BoardWriteState> = (state: BoardWriteState | undefined, incomingAction: Action): BoardWriteState => {
    if (state === undefined) {
        return {
                boardtitle: '',
                boardauthor: '',
                boardcontents: '',
        }
    };
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'boardWrite/UpdateToggle':
            return {
                ...state,
                boardtitle: action.payload.boardtitle,
                boardauthor: action.payload.boardauthor!,
                boardcontents: action.payload.boardcontents,
            };
        case 'boardWrite/WriteSetBoardAuthor':
            return {
                ...state,
                boardauthor: action.meta.boardauthor
            }
        case 'boardWrite/OnChange':
            return {
                ...state,
                [action.meta.targetName]: action.meta.targetValue
            }
        case 'boardWrite/ResetBoardWrite':
            return {
                boardtitle: '',
                boardauthor: '',
                boardcontents: '',
            }
        default:
            return state;
    }
};
