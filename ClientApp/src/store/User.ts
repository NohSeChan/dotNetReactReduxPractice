import { Action, Reducer } from 'redux';

export interface UserState {
    id: string,
    password: string,
}

export interface HandleOnChangeAction {
    type: 'user/ONCHANGNE',
    meta: {
        e: any
    }
}
type KnownAction = HandleOnChangeAction;

export const actionCreators = {
    handleOnChange: (e: any) => ({
        type: 'user/ONCHANGNE',
        meta: {
            e
        }
    } as HandleOnChangeAction),
};

export const reducer: Reducer<UserState> = (state: UserState | undefined, incomingAction: Action): UserState => {
    if (state === undefined) {
        return {
            id: '',
            password: ''
        };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'user/ONCHANGNE':
            return {
                ...state,
                [action.meta.e.currentTarget.name]: action.meta.e.currentTarget.value
            };
        default:
            return state;
    }
};
