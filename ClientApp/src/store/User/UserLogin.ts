import { Action, Reducer } from 'redux';

export interface UserState {
    id: string,
    password: string,
}

export interface HandleOnChangeAction {
    type: 'userLogin/OnChange',
    meta: {
        targetName: string,
        targetValue: string
    }
}
type KnownAction = HandleOnChangeAction;

export const actionCreators = {
    handleOnChange: (targetName: string, targetValue: string) => ({
        type: 'userLogin/OnChange',
        meta: {
            targetName,
            targetValue
        }
    }),
};

export const reducer: Reducer<UserState> = (state: UserState | undefined, incomingAction: Action): UserState => {
    if (state === undefined) {
        return {
            id: '',
            password: '',
        };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'userLogin/OnChange':
            return {
                ...state,
                [action.meta.targetName]: action.meta.targetValue
            };
        default:
            return state;
    }
};
