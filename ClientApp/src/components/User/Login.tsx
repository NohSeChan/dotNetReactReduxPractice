import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as UserLoginStore from '../../store/User/UserLogin';
import { Link } from 'react-router-dom';
import * as utils from '../../utils/util';
import { store } from '../../index';

type LoginProps =
    UserLoginStore.UserState &
    typeof UserLoginStore.actionCreators &
    RouteComponentProps<{}>;

class Login extends React.PureComponent<LoginProps> {

    componentDidMount = () => {
        if (store.getState().router.action === 'POP') {
            document.getElementById('loginLink')!.click();
        }
    }

    handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const targetName = e.currentTarget.name;
        const targetValue = e.currentTarget.value;
        this.props.handleOnChange(targetName, targetValue);
    }

    handleLogin = (e: any) => {
        e.preventDefault();
        fetch('Login', {
            method: 'post',
            body: JSON.stringify({
                id: this.props.id,
                password: this.props.password
            }),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=UTF-8'
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
            })
    }

    handleMoveRegist = () => {
        //document.getElementById('registLink')!.className = "nav-link active";
        //document.getElementById('loginLink')!.className = "nav-link";
        document.getElementById('registLink')!.click();
    }
    
    public render() {
        return (
            <React.Fragment>
                <h1>????????? ?????????</h1>
                <form>
                    <div>
                        <label>????????? : &nbsp;&nbsp;</label>
                        <input
                            type="text"
                            name="id"
                            className="form-control"
                            style={{ display: 'inline', width: '180px' }}
                            value={this.props.id}
                            onChange={this.handleChange}
                            placeholder="????????? ??????"
                        />
                    </div>
                    <div>
                        <label>???????????? :&nbsp;</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            style={{ display: 'inline', width: '180px' }}
                            value={this.props.password}
                            onChange={this.handleChange}
                            placeholder="???????????? ??????"
                        />
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={this.handleLogin}>
                        ?????????
                    </button>
                    &nbsp;
                    <Link to='/register'><button className="btn btn-sm btn-primary" type="button" onClick={this.handleMoveRegist}>????????????</button></Link>
                </form>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.userLogin,
    UserLoginStore.actionCreators
)(Login);
