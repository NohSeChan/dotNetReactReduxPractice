import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/User/Login';
import Register from './components/User/Register';
import './custom.css'
import Board from './components/Board/Board';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route exact path='/board' component={Board} />
    </Layout>
);
