import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CounterStore from '../../store/Counter';
import { Link } from 'react-router-dom';

type LoginProps =
    CounterStore.CounterState &
    typeof CounterStore.actionCreators &
    RouteComponentProps<{}>;

class Login extends React.PureComponent<LoginProps> {
    state = {
        id: '',
        password: '',
    }

    handleChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLogin = (e: any) => {
        e.preventDefault();
        console.log('id ' + this.state.id);
        console.log('password ' + this.state.password);
    }

    public render() {
        return (
            <React.Fragment>
                <h1>로그인 페이지</h1>
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
                    <button onClick={this.handleLogin}>
                        로그인
                    </button>
                    &nbsp;
                    <Link to='/register'><button type="button">회원가입</button></Link>
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

export default Login;
