import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import * as utils from '../../utils/util';

type LoginProps =
    CounterStore.CounterState &
    typeof CounterStore.actionCreators &
    RouteComponentProps<{}>;

class Register extends React.PureComponent<LoginProps> {
    state = {
        id: '',
        userName: '',
        password: '',
        password2: '',
        idFormCheck: false,
        idFormCheckMsg: '',
        idCheck: false,
        idCheckMsg: '',
        userNameCheck: false,
        userNameCheckMsg: '',
        passwordLegnthCheck: false,
        passwordEqualCheck: false
    }

    regExp = /[^a-zA-Z0-9]/;


    handleChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value
        });

        if (e.target.name === 'id' && e.target.value.match(this.regExp) !== null) {
            this.setState({
                idFormCheck: false,
                idFormCheckMsg: '※ 아이디에는 영문자와 숫자만 입력가능합니다'
            });
        } else if (e.target.name === 'id' && e.target.value.match(this.regExp) === null) {
            this.setState({
                idFormCheck: true,
                idFormCheckMsg: '',
            });
        } else if (e.target.name === 'password' && e.target.value.length < 8) {
            this.setState({
                passwordLegnthCheck: false
            });
        } else if (e.target.name === 'password' && e.target.value.length >= 8) {
            this.setState({
                passwordLegnthCheck: true
            });
        } else if (e.target.name === 'password2' && this.state.password === e.target.value) {
            this.setState({
                passwordEqualCheck: true
            });
        } else if (e.target.name === 'password2' && this.state.password !== e.target.value) {
            this.setState({
                passwordEqualCheck: false
            })
        }
    };

    handleRegister = (e: any) => {
        e.preventDefault();
        if (this.state.id === '') {
            alert('아이디를 입력해주세요');
            return;
        } else if (this.state.userName === '') {
            alert('닉네임을 입력해주세요');
            return;
        } else if (!this.state.idFormCheck) {
            alert(this.state.idFormCheckMsg);
            return;
        } else if (!this.state.idCheck) {
            alert(this.state.idCheckMsg);
            return;
        } else if (!this.state.userNameCheck) {
            alert(this.state.userNameCheckMsg);
            return;
        } else if (!this.state.passwordLegnthCheck) {
            alert('비밀번호는 8자 이상 입력해주세요');
            return;
        }
        
        fetch(`Register`, {
            method: 'post',
            body: JSON.stringify({
                id: this.state.id,
                userName: this.state.userName,
                password: this.state.password,
                password2: this.state.password2,
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
        e.preventDefault()
        this.setState({
            id: '',
            userName: '',
            password: '',
            password2: '',
        });
    }

    handleOnBlurId = () => {
        fetch(`SelectUserById?id=${this.state.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'DUPLICATE') {
                    this.setState({
                        idCheck: false,
                        idCheckMsg: '※ 이미 존재하는 ID입니다'
                    });
                } else if (data.msg === 'OK') {
                    this.setState({
                        idCheck: true,
                        idCheckMsg: ''
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
    }

    handleOnBlurUserName = () => {
        fetch(`SelectUserByUserName?userName=${this.state.userName}`)
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'DUPLICATE') {
                    this.setState({
                        userNameCheck: false,
                        userNameCheckMsg: '※ 이미 존재하는 닉네임입니다'
                    });
                } else if (data.msg === 'OK') {
                    this.setState({
                        userNameCheck: true,
                        userNameCheckMsg: ''
                    });
                } else if (data.msg === 'FAIL') {
                    alert(data.exceptionMsg);
                }
            });
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
                            value={this.state.id}
                            onChange={this.handleChange}
                            placeholder="아이디 입력"
                            onBlur={this.handleOnBlurId}
                        />
                        &nbsp; {!this.state.idFormCheck ? <label style={{ color: 'red' }}>{this.state.idFormCheckMsg}</label> : null}
                        {!this.state.idCheck ? <label style={{ color: 'red' }}>{this.state.idCheckMsg}</label> : null}
                        {this.state.idFormCheck && this.state.idCheck && this.state.id.length !== 0 ? <label style={{ color: 'green' }}>적절한 ID입니다</label>  : null}
                    </div>
                    <div>
                        <label>닉네임 : &nbsp;&nbsp;</label>
                        <input
                            type="text"
                            name="userName"
                            value={this.state.userName}
                            onChange={this.handleChange}
                            placeholder="닉네임 입력"
                            onBlur={this.handleOnBlurUserName}
                        />
                        &nbsp; {!this.state.userNameCheck || this.state.userName.length === 0 ? <label style={{ color: 'red' }}>{this.state.userNameCheckMsg}</label> : <label style={{ color: 'green' }}>적절한 닉네임입니다</label>}
                    </div>
                    <div>
                        <label>패스워드 :&nbsp;</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="패스워드 입력"
                        />
                        &nbsp; {!this.state.passwordLegnthCheck && this.state.password.length > 0 ? <label style={{ color: 'red' }}>※ 패스워드는 8자 이상 입력해주세요</label> : null}
                        {this.state.passwordLegnthCheck ? <label style={{ color: 'green' }}>적절한 비밀번호입니다</label> : null}
                    </div>
                    <div>
                        <label>패스워드 확인 : &nbsp;</label>
                        <input
                            type="password"
                            name="password2"
                            value={this.state.password2}
                            onChange={this.handleChange}
                            placeholder="패스워드 확인"
                        />
                        &nbsp; {!this.state.passwordEqualCheck && this.state.password2.length > 0 ? <label style={{ color: 'red' }}>※ 패스워드를 일치시켜주세요</label> : null}
                        {this.state.passwordEqualCheck ? <label style={{ color: 'green' }}>비밀번호가 일치합니다</label> : null}
                    </div>
                    <button onClick={this.handleRegister}>
                        회원가입
                    </button>
                    &nbsp;
                    <button onClick={this.handleReset}>
                        초기화
                    </button>
                </form>
            </React.Fragment>


            //<React.Fragment>
            //    <h1>Counter</h1>

            //    <p>This is a simple example of a React component.</p>

            //    <p aria-live="polite">Current count: <strong>{this.props.count}</strong></p>

            //    <button type="button"
            //        className="btn btn-primary btn-lg"
            //        onClick={() => { this.props.increment(); }}>
            //        Increment
            //    </button>
            //</React.Fragment>
        );
    }
};

//export default connect(
//    (state: ApplicationState) => state.counter,
//    CounterStore.actionCreators
//)(Login);

export default Register;
