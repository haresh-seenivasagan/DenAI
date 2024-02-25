import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import UploadPage from '/Volumes/Extreme SSD/DenAI/src/views/UploadPage.js';
import ReportPage from './views/ReportPage';


import './style.css'
import Home from '/Volumes/Extreme SSD/DenAI/src/views/home.js'
import  NotFound  from '/Volumes/Extreme SSD/DenAI/src/views/not-found.js'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route path="/upload" component={UploadPage} />
        <Route component={NotFound} exact path="/not-found" />
        <Route component={ReportPage} path="/report" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
