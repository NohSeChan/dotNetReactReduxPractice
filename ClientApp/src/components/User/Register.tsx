import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as UserRegisterStore from '../../store/User/UserRegister';
import * as utils from '../../utils/util';

type LoginProps =
    UserRegisterStore.UserState &
    typeof UserRegisterStore.actionCreators &
    RouteComponentProps<{}>;

class Register extends React.PureComponent<LoginProps> {
    regExp = /[^a-zA-Z0-9]/;
    regExp2 = /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^\w\s]).*/;

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const targetName = e.currentTarget.name;
        const targetValue = e.currentTarget.value;
        this.props.handleOnChange(targetName, targetValue);

        if (e.currentTarget.name === 'id' && e.currentTarget.value.match(this.regExp) !== null) {
            this.props.handleFormIdCheck(false, '※ 아이디에는 영문자와 숫자만 입력가능합니다');
        } else if (e.currentTarget.name === 'id' && e.currentTarget.value.match(this.regExp) === null) {
            this.props.handleFormIdCheck(true, '');
        } else if (e.currentTarget.name === 'password') {
            if (e.currentTarget.value.match(this.regExp2) === null) {
                this.props.handlePasswordValidationCheck(false, '※ 비밀번호는 영문자/숫자/특수문자가 조합되어야합니다');
            } else {
                this.props.handlePasswordValidationCheck(true, '');
            }
            if (e.currentTarget.value.length < 8) {
                this.props.handlePasswordLegnthCheck(false);
            } else {
                this.props.handlePasswordLegnthCheck(true);
            }
        } else if (e.currentTarget.name === 'password2' && this.props.password === e.currentTarget.value) {
            this.props.handlePasswordEqualCheck(true);
        } else if (e.currentTarget.name === 'password2' && this.props.password !== e.currentTarget.value) {
            this.props.handlePasswordEqualCheck(false);
        }
    };

    handleRegister = (e: any) => {
        e.preventDefault();
        if (this.props.id === '') {
            alert('아이디를 입력해주세요');
            return;
        } else if (this.props.userName === '') {
            alert('닉네임을 입력해주세요');
            return;
        } else if (!this.props.idFormCheck) {
            alert(this.props.idFormCheckMsg);
            return;
        } else if (!this.props.idDuplCheck) {
            alert(this.props.idDuplCheckMsg);
            return;
        } else if (!this.props.userNameCheck) {
            alert(this.props.userNameCheckMsg);
            return;
        } else if (!this.props.passwordLegnthCheck) {
            alert('비밀번호는 8자 이상 입력해주세요');
            return;
        } else if (!this.props.passwordValidationCheck) {
            alert(this.props.passwordValdiationCheckMsg);
            return;
        } else if (!this.props.passwordEqualCheck) {
            alert('패스워드를 일치시켜주세요');
            return;
        }
        
        fetch(`Register`, {
            method: 'post',
            body: JSON.stringify({
                id: this.props.id,
                userName: this.props.userName,
                password: this.props.password,
                password2: this.props.password2,
            }),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    document.cookie = "id=" + data.id;
                    document.cookie = "userName=" + utils.strToAscii(data.userName);
                    document.location.href = "/";
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    handleReset = (e: any) => {
        e.preventDefault();
        this.props.handleReset();
    }

    handleOnBlurId = () => {
        fetch(`SelectUserById?id=${this.props.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'DUPLICATE') {
                    this.props.handleIdDuplCheck(false, '※ 이미 존재하는 ID입니다')
                } else if (data.msg === 'OK') {
                    this.props.handleIdDuplCheck(true, '')
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    handleOnBlurUserName = () => {
        fetch(`SelectUserByUserName?userName=${this.props.userName}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'DUPLICATE') {
                    this.props.handleUserNameCheck(false, '※ 이미 존재하는 닉네임입니다')
                } else if (data.msg === 'OK') {
                    this.props.handleUserNameCheck(true, '')
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    componentWillUnmount() {
        this.props.handleReset();
    }


    public render() {
        return (
            <React.Fragment>
                <h1>회원가입 페이지</h1>
                <form>
                    <div>
                        <label>아이디 : &nbsp;&nbsp;</label>
                        <input
                            type="text"
                            name="id"
                            className="form-control"
                            style={{display:'inline', width: '180px'}}
                            value={this.props.id}
                            onChange={this.handleChange}
                            placeholder="아이디 입력"
                            onBlur={this.handleOnBlurId}
                        />
                        &nbsp; {!this.props.idFormCheck ? <label style={{ color: 'red' }}>{this.props.idFormCheckMsg}</label> : null}
                        {!this.props.idDuplCheck ? <label style={{ color: 'red' }}>{this.props.idDuplCheckMsg}</label> : null}
                        {this.props.idFormCheck && this.props.idDuplCheck && this.props.id.length !== 0 ? <label style={{ color: 'green' }}>적절한 ID입니다</label>  : null}
                    </div>
                    <div>
                        <label>닉네임 : &nbsp;&nbsp;</label>
                        <input
                            type="text"
                            name="userName"
                            className="form-control"
                            style={{ display: 'inline', width: '180px' }}
                            value={this.props.userName}
                            onChange={this.handleChange}
                            placeholder="닉네임 입력"
                            onBlur={this.handleOnBlurUserName}
                        />
                        &nbsp; {!this.props.userNameCheck || this.props.userName.length === 0 ? <label style={{ color: 'red' }}>{this.props.userNameCheckMsg}</label> : <label style={{ color: 'green' }}>적절한 닉네임입니다</label>}
                    </div>
                    <div>
                        <label>패스워드 :&nbsp;</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            style={{ display: 'inline', width: '180px' }}
                            value={this.props.password}
                            onChange={this.handleChange}
                            placeholder="패스워드 입력"
                        />
                        &nbsp; {!this.props.passwordLegnthCheck && this.props.password.length > 0 ? <label style={{ color: 'red' }}>※ 패스워드는 8자 이상 입력해주세요</label> : null}
                        &nbsp; {!this.props.passwordValidationCheck && this.props.password.length > 0 ? <label style={{ color: 'red' }}>{this.props.passwordValdiationCheckMsg}</label> : null}
                        {this.props.passwordLegnthCheck && this.props.passwordValidationCheck ? <label style={{ color: 'green' }}>적절한 비밀번호입니다</label> : null}
                    </div>
                    <div>
                        <label>패스워드 확인 : &nbsp;</label>
                        <input
                            type="password"
                            name="password2"
                            className="form-control"
                            style={{ display: 'inline', width: '180px' }}
                            value={this.props.password2}
                            onChange={this.handleChange}
                            placeholder="패스워드 확인"
                        />
                        &nbsp; {!this.props.passwordEqualCheck && this.props.password2.length > 0 ? <label style={{ color: 'red' }}>※ 패스워드를 일치시켜주세요</label> : null}
                        {this.props.passwordEqualCheck ? <label style={{ color: 'green' }}>비밀번호가 일치합니다</label> : null}
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={this.handleRegister}>
                        회원가입
                    </button>
                    &nbsp;
                    <button className="btn btn-sm btn-secondary" onClick={this.handleReset}>
                        초기화
                    </button>
                </form>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.userRegister,
    UserRegisterStore.actionCreators
)(Register);


