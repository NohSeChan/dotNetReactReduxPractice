import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean, homeToggle: boolean, boardToggle: boolean, loginToggle: boolean, registToggle: boolean }> {
    public state = {
        isOpen: false,
        homeToggle: true,
        boardToggle: false,
        loginToggle: false,
        registToggle: false,
    };

    value = document.cookie.match('(^|;) ?' + 'id' + '=([^;]*)(;|$)');
    handleLogout = () => {
        fetch(`Logout`, {
            method: 'post'
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg === 'OK') {
                    document.cookie = 'id=;'
                    document.cookie = 'userName=;'
                    document.location.href = '/';
                }
            });
    }

    resetToggleButton = () => {
        this.setState({
            homeToggle: false,
            boardToggle: false,
            loginToggle: false,
            registToggle: false,
        })
    }

    handleToggleHomeButton = () => {
        this.resetToggleButton();
        this.setState({
            homeToggle: true
        });
    }

    handleToggleBoardButton = () => {
        this.resetToggleButton();
        this.setState({
            boardToggle: true
        });
    }

    handleToggleLoginButton = () => {
        this.resetToggleButton();
        this.setState({
            loginToggle: true
        });
    }

    handleToggleRegistButton = () => {
        this.resetToggleButton();
        this.setState({
            registToggle: true
        });
    }

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand onClick={this.handleToggleHomeButton} tag={Link} to="/">이카운트 제출용 포트폴리오</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="nav nav-pills">
                                <NavItem>
                                    <NavLink tag={Link} onClick={this.handleToggleHomeButton} className={this.state.homeToggle ? "nav-link active" : "nav-link" } to="/">Home</NavLink>
                                </NavItem>
                                {/*<NavItem>*/}
                                {/*    <NavLink tag={Link} className="text-dark" to="/counter">카운트</NavLink>*/}
                                {/*</NavItem>*/}
                                {/*<NavItem>*/}
                                {/*    <NavLink tag={Link} className="text-dark" to="/fetch-data">날씨</NavLink>*/}
                                {/*</NavItem>*/}
                                <NavItem>
                                    <NavLink tag={Link} onClick={this.handleToggleBoardButton} className={this.state.boardToggle ? "nav-link active" : "nav-link"} to="/board">게시판</NavLink>
                                </NavItem>
                                <NavItem>
                                    {this.value && this.value[2] ? null : <NavLink tag={Link} onClick={this.handleToggleRegistButton} className={this.state.registToggle ? "nav-link active" : "nav-link"} to="/register">회원가입</NavLink>}
                                </NavItem>
                                <NavItem>
                                    {this.value && this.value[2] ? <NavLink tag={Link} className="nav-link" onClick={this.handleLogout} to="/">로그아웃</NavLink> : <NavLink tag={Link} onClick={this.handleToggleLoginButton} className={this.state.loginToggle ? "nav-link active" : "nav-link"} to="/login">로그인</NavLink>}
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
