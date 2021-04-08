import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';

type LoginProps =
    CounterStore.CounterState &
    typeof CounterStore.actionCreators &
    RouteComponentProps<{}>;

class Register extends React.PureComponent<LoginProps> {
    state = {
        id: '',
        password: '',
        password2: '',
    }

    handleChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRegister = (e: any) => {
        e.preventDefault()
        console.log('id ' + this.state.id);
        console.log('password ' + this.state.password);
        console.log('password2 ' + this.state.password2);
    }

    handleReset = (e: any) => {
        e.preventDefault()
        this.setState({
            id: '',
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
