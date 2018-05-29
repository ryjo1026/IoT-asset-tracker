import React from 'react';
import {Switch, Route} from 'react-router-dom';

// Import all routed components
import Home from './Home/Home.jsx';
import Register from './Register/Register.jsx';
import Search from './Search/Search.jsx';

const Router = () => (
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/home' component={Home}/>
    <Route exact path='/register' component={Register}/>
    <Route exact path='/update' component={Home}/>
    <Route exact path='/search' component={Search}/>
    {/* TODO <Route component={404}/> */}
  </Switch>
);


export default Router;
