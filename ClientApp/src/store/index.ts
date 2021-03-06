import * as UserLogin from './User/UserLogin';
import * as UserRegister from './User/UserRegister';
import * as Board from './Board/Board';
import * as BoardContents from './Board/BoardContents';
import * as BoardWrite from './Board/BoardWrite';
import * as BoardReply from './Board/BoardReply';

// The top-level state object
export interface ApplicationState {
    userLogin: UserLogin.UserState | undefined;
    userRegister: UserRegister.UserState | undefined;
    board: Board.BoardState | undefined;
    boardContents: BoardContents.BoardContentsState | undefined;
    boardWrite: BoardWrite.BoardWriteState | undefined;
    boardReply: BoardReply.BoardReplyState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    userLogin: UserLogin.reducer,
    userRegister: UserRegister.reducer,
    board: Board.reducer,
    boardContents: BoardContents.reducer,
    boardWrite: BoardWrite.reducer,
    boardReply: BoardReply.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
