import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from "react-redux";
import { withRouter } from 'react-router-dom';
import { auth } from '../../../Store/auth'
import { toast } from 'react-toastify';



const Login = (props) => {
  const notify = () => toast.error('Please Fill All Fileds!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,

  });
  const dispatch = useDispatch();
  const [values, setValues] = React.useState({
    email: '',
    password: '',

  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const loginHandler = async () => {

    if (values.email == '' || values.password == '')
      notify()
    else {
      const respons = await auth(values.email, values.password)

      dispatch({ respons: respons, type: 'Login' })
      props.history.push('/')
    }
  }


  return (


    <form   >
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} >   <TextField id="Email" label="Email" type='email' fullWidth onChange={handleChange('email')} value={values.email} /></Grid>
        <Grid item xs={12}  >    <TextField id="Password" label="Password" fullWidth type='password' value={values.password} onChange={handleChange('password')} /></Grid>
        <Grid item xs={12}>     <Button onClick={loginHandler} variant="contained" color="primary" fullWidth>
          Login
        </Button>
        </Grid>
      </Grid>
    </form>

  );
}

export default withRouter(Login);