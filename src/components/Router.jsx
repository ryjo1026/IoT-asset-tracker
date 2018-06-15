import React from 'react';
import {Switch, Route} from 'react-router-dom';

// Import all routed components
import Home from './Home/Home.jsx';
import Manage from './Manage/ManageContainer.jsx';
import Register from './Register/RegisterContainer.jsx';
import Search from './Search/SearchContainer.jsx';

import withWeb3 from './Common/WithWeb3.jsx';

const Router = () => (
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/home' component={Home}/>
    <Route exact path='/manage' component={withWeb3(Manage)}/>
    <Route exact path='/register' component={withWeb3(Register)}/>
    <Route exact path='/search' component={withWeb3(Search)}/>
    {/* TODO <Route component={404}/> */}
  </Switch>
);


export default Router;
