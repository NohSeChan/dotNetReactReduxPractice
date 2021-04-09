import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
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
                    document.location.href = '/';
                }
            });

    }

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">이카운트 제출용 포트폴리오</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/counter">카운트</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/fetch-data">날씨</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/fetch-data">Study Together</NavLink>
                                </NavItem>
                                <NavItem>
                                    {this.value && this.value[2] ? null : <NavLink tag={Link} className="text-dark" to="/register">회원가입</NavLink>}
                                </NavItem>
                                <NavItem>
                                    {/*{this.value && this.value[2] ? <NavLink tag={Link} className="text-dark"><button onClick={ this.handleLogout }>로그아웃</button></NavLink> : <NavLink tag={Link} className="text-dark" to="/login">로그인</NavLink>}*/}
                                    {this.value && this.value[2] ? <NavLink tag={Link} className="text-dark" onClick={this.handleLogout}>로그아웃</NavLink> : <NavLink tag={Link} className="text-dark" to="/login">로그인</NavLink>}
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
