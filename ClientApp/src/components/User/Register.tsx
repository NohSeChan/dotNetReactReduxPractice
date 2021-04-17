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
        idCheck: true,
    }

    regExp = /[^a-zA-Z0-9]/;


    handleChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value
        });

        if (e.target.name === 'id' && e.target.value.match(this.regExp) !== null) {
            this.setState({
                idCheck: false
            });
        } else if (e.target.name === 'id' && e.target.value.match(this.regExp) === null) {
            this.setState({
                idCheck: true
            });
        }
    }

    handleRegister = (e: any) => {
        e.preventDefault();

        if (!this.state.idCheck) {
            alert('아이디에는 영문자와 숫자만 입력가능합니다');
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
                        />
                        {!this.state.idCheck ? <div style={{color: 'red'}}>※ 아이디에는 영문자와 숫자만 입력가능합니다</div> : null}
                    </div>
                    <div>
                        <label>닉네임 : &nbsp;&nbsp;</label>
                        <input
                            type="text"
                            name="userName"
                            value={this.state.userName}
                            onChange={this.handleChange}
                            placeholder="닉네임 입력"
                        />
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
