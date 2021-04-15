import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import Login from './components/User/Login';
import Register from './components/User/Register';

import './custom.css'
import Board from './components/Board/Board';
import BoardWrite from './components/Board/BoardWrite';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/board' component={Board} />
        <Route path='/board/write' component={BoardWrite} />
    </Layout>
);
