import { Action, Reducer } from 'redux';


export interface BoardWriteState {
    boardno?: number;
    boardtitle: string;
    boardauthor: string;
    boardcontents: string;
}

export interface HandleUpdateToggleAction {
    type: 'boardWrite/UpdateToggle',
    payload: BoardWriteState
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
        e: React.FormEvent<HTMLInputElement>
    }
}
type KnownAction = HandleUpdateToggleAction | HandleWriteSetBoardAuthorAction | HandleOnChangeAction;

export const actionCreators = {
    handleUpdateToggle: (boardDetail: BoardWriteState) => ({
        type: 'boardWrite/UpdateToggle',
        payload: boardDetail
    }),
    handleWriteSetBoardAuthor: (boardauthor: string) => ({
        type: 'boardWrite/WriteSetBoardAuthor',
        meta: {
            boardauthor
        }
    }),
    handleOnChange: (e: React.FormEvent<HTMLInputElement>) => ({
        type: 'boardWrite/OnChange',
        meta: {
            e
        }
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
                boardauthor: action.payload.boardauthor,
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
                [action.meta.e.currentTarget.name]: action.meta.e.currentTarget.value
            }
        default:
            return state;
    }
};
