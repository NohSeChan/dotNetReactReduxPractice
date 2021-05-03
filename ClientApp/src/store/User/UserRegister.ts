import { Action, Reducer } from 'redux';

export interface UserState {
    id: string,
    password: string,
    userName: string,
    password2: string,
    idFormCheck: boolean,
    idFormCheckMsg: string,
    idDuplCheck: boolean,
    idDuplCheckMsg: string,
    userNameCheck: boolean,
    userNameCheckMsg: string,
    passwordLegnthCheck: boolean,
    passwordEqualCheck: boolean,
    passwordValidationCheck: boolean,
    passwordValdiationCheckMsg: string,
}

export interface HandleOnChangeAction {
    type: 'userRegister/ONCHANGNE',
    meta: {
        e: any
    }
}
export interface HandleIdFormCheckAction {
    type: 'userRegister/IdFormCheck',
    meta: {
        idFormCheck: boolean,
        idFormCheckMsg: string
    }
}
export interface HandlePasswordValidationCheckAction {
    type: 'userRegister/PasswordValidationCheck',
    meta: {
        passwordValidationCheck: boolean,
        passwordValdiationCheckMsg: string
    }
}
export interface HandlePasswordLegnthCheckAction {
    type: 'userRegister/PasswordLegnthCheck',
    meta: {
        passwordLegnthCheck: boolean,
    }
}
export interface HandlePasswordEqualCheckAction {
    type: 'userRegister/PasswordEqualCheck',
    meta: {
        passwordEqualCheck: boolean,
    }
}
export interface HandlePasswordEqualCheckAction {
    type: 'userRegister/PasswordEqualCheck',
    meta: {
        passwordEqualCheck: boolean,
    }
}
export interface HandleResetAction {
    type: 'userRegister/Reset',
}
export interface HandleIdDuplCheckAction {
    type: 'userRegister/IdDuplCheck',
    meta: {
        idDuplCheck: boolean,
        idDuplCheckMsg: string
    }
}
export interface HandleUserNameCheckAction {
    type: 'userRegister/UserNameCheck',
    meta: {
        userNameCheck: boolean,
        userNameCheckMsg: string
    }
}
type KnownAction = HandleOnChangeAction | HandleIdFormCheckAction | HandlePasswordValidationCheckAction | HandlePasswordLegnthCheckAction | HandlePasswordEqualCheckAction | HandleResetAction
    | HandleIdDuplCheckAction | HandleUserNameCheckAction;

export const actionCreators = {
    handleOnChange: (e: any) => ({
        type: 'userRegister/ONCHANGNE',
        meta: {
            e
        }
    } as HandleOnChangeAction),
    handleFormIdCheck: (idFormCheck: boolean, idFormCheckMsg: string) => ({
        type: 'userRegister/IdFormCheck',
        meta: {
            idFormCheck,
            idFormCheckMsg
        }
    }),
    handlePasswordValidationCheck: (passwordValidationCheck: boolean, passwordValdiationCheckMsg: string) => ({
        type: 'userRegister/PasswordValidationCheck',
        meta: {
            passwordValidationCheck,
            passwordValdiationCheckMsg
        }
    }),
    handlePasswordLegnthCheck: (passwordLegnthCheck: boolean) => ({
        type: 'userRegister/PasswordLegnthCheck',
        meta: {
            passwordLegnthCheck
        }
    }),
    handlePasswordEqualCheck: (passwordEqualCheck: boolean) => ({
        type: 'userRegister/PasswordEqualCheck',
        meta: {
            passwordEqualCheck
        }
    }),
    handleReset: () => ({
        type: 'userRegister/Reset',
    }),
    handleIdDuplCheck: (idDuplCheck: boolean, idDuplCheckMsg: string) => ({
        type: 'userRegister/IdDuplCheck',
        meta: {
            idDuplCheck,
            idDuplCheckMsg
        }
    }),
    handleUserNameCheck: (userNameCheck: boolean, userNameCheckMsg: string) => ({
        type: 'userRegister/UserNameCheck',
        meta: {
            userNameCheck,
            userNameCheckMsg
        }
    }),
};



export const reducer: Reducer<UserState> = (state: UserState | undefined, incomingAction: Action): UserState => {
    if (state === undefined) {
        return {
            id: '',
            userName: '',
            password: '',
            password2: '',
            idFormCheck: false,
            idFormCheckMsg: '',
            idDuplCheck: false,
            idDuplCheckMsg: '',
            userNameCheck: false,
            userNameCheckMsg: '',
            passwordLegnthCheck: false,
            passwordEqualCheck: false,
            passwordValidationCheck: false,
            passwordValdiationCheckMsg: '',
        };
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'userRegister/ONCHANGNE':
            return {
                ...state,
                [action.meta.e.currentTarget.name]: action.meta.e.currentTarget.value
            };
        case 'userRegister/IdFormCheck':
            return {
                ...state,
                idFormCheck: action.meta.idFormCheck,
                idFormCheckMsg: action.meta.idFormCheckMsg
            }
        case 'userRegister/PasswordValidationCheck':
            return {
                ...state,
                passwordValidationCheck: action.meta.passwordValidationCheck,
                passwordValdiationCheckMsg: action.meta.passwordValdiationCheckMsg
            }
        case 'userRegister/PasswordLegnthCheck':
            return {
                ...state,
                passwordLegnthCheck: action.meta.passwordLegnthCheck,
            }
        case 'userRegister/PasswordEqualCheck':
            return {
                ...state,
                passwordEqualCheck: action.meta.passwordEqualCheck,
            }
        case 'userRegister/Reset':
            return {
                ...state,
                id: '',
                userName: '',
                password: '',
                password2: '',
                idFormCheck: false,
                idFormCheckMsg: '',
                idDuplCheck: false,
                idDuplCheckMsg: '',
                userNameCheck: false,
                userNameCheckMsg: '',
                passwordLegnthCheck: false,
                passwordEqualCheck: false,
                passwordValidationCheck: false,
                passwordValdiationCheckMsg: '',
            }
        case 'userRegister/IdDuplCheck':
            return {
                ...state,
                idDuplCheck: action.meta.idDuplCheck,
                idDuplCheckMsg: action.meta.idDuplCheckMsg
            }
        case 'userRegister/UserNameCheck':
            return {
                ...state,
                userNameCheck: action.meta.userNameCheck,
                userNameCheckMsg: action.meta.userNameCheckMsg
            }
        default:
            return state;
    }
};
