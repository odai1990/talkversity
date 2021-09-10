import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Components/Layout/header';
import Footer from './Components/Layout/footer';
import Courses from './Components/Courses/courses';
import LoginTabs from './Components/Auth/Container/loginTabs'
import Grid from '@material-ui/core/Grid';
import Background from './Assets/Images/loginBackground.jpg'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



const StyleMain = {
  backgroundImage: "url(" + Background + ")",
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  minHeight: "100vh"
}
const StyleFooter = {
  padding: 0

}



class App extends Component {
  componentDidMount() {
    if (localStorage.getItem('data')) {
      this.props.onTryAutoSignup();
      this.props.history.push('/');
    }
  }

  render() {   
console.log(this.props.isAuthenticated)
    let routes = (
      <Switch>

        <Route path="/auth" exact component={LoginTabs} {...this.props} />
        <Redirect to="/auth" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={Courses} />
          <Redirect to="/" />
        </Switch>
      );
    }
    console.log(this.props.location.pathname)
    return (
      <div>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12} ><Header /> <ToastContainer /></Grid>
          <Grid item xs={12} style={this.props.location.pathname === '/auth' ? StyleMain : { minHeight: "100vh" }} >  {routes}</Grid>
          <Grid item xs={12} style={StyleFooter}>   <Footer /></Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.isAuthenticated,
    email: state.email,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch({ respons: JSON.parse(window.localStorage.getItem('data')), type: 'Login' })
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
