import React from 'react';
import {Switch, Route} from 'react-router-dom';

// Import all routed components
import Home from './Home/Home.jsx';
import Manage from './Manage/ManageContainer.jsx';
import Register from './Register/RegisterContainer.jsx';
import Search from './Search/SearchContainer.jsx';

const Router = () => (
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/home' component={Home}/>
    <Route exact path='/manage' component={Manage}/>
    <Route exact path='/register' component={Register}/>
    <Route exact path='/search' component={Search}/>
    {/* TODO <Route component={404}/> */}
  </Switch>
);


export default Router;
