import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from "react-redux";
import { withRouter } from 'react-router-dom';
import { signUp } from '../../../Store/auth'
import { toast } from 'react-toastify';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from "@material-ui/icons/Add";
import { Fab, Button } from "@material-ui/core";

const Register = (props) => {
  const notify = (type) => toast.error(type, {
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
    confirmPassword: '',
    firsName: '',
    lastName: '',
    gender: '',
    file: ''

  });

  const gender = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    }
  ];




  const handleChange = (prop) => (event) => {

    if (prop == 'file')
      setValues({ ...values, [prop]: event.target.files[0] });
    else
      setValues({ ...values, [prop]: event.target.value });
  };




  const signupHandler = async () => {

    if (values.email === '' || values.password === ''
      || values.firsName === '' || values.lastName === ''
      || values.gender === '' || values.number === ''
      || values.file === '' || values.confirmPassword === '')
    
        notify('Please Fill All Fileds!');
      
    else {
      if (values.password !== values.confirmPassword)
      {
      notify('Password Not Match!');
      return;
      }

   
      const respons = await signUp(values)
      if (respons == 'Invalied Email!')
        notify('Invalied Email!')
      else {
        dispatch({ respons: respons, type: 'SignUp' })
        props.history.push('/')
      }
    }
  }


  return (


    <form   >
      <Grid container spacing={2} direction="column">
        <Grid item xs={12} >   <TextField id="Email" label="Email" type='email' fullWidth onChange={handleChange('email')} value={values.email} /></Grid>
        <Grid item xs={12}  >    <TextField id="Password" label="Password" fullWidth type='password' value={values.password} onChange={handleChange('password')} /></Grid>
        <Grid item xs={12}  >    <TextField id="conPassword" label="Confirm Password" fullWidth type='password' value={values.confirmPassword} onChange={handleChange('confirmPassword')} /></Grid>
        <Grid item xs={12}  >    <TextField id="FirstName" label="FirstName" fullWidth type='text' value={values.firsName} onChange={handleChange('firsName')} /></Grid>
        <Grid item xs={12}  >    <TextField id="LastName" label="LastName" fullWidth type='text' value={values.lastName} onChange={handleChange('lastName')} /></Grid>
        <Grid item xs={12}  >
          <TextField
            id="standard-select-currency"
            select
            label="Select"
            value={values.gender}
            onChange={handleChange('gender')}
            helperText="Please select your gender"
            fullWidth
          >
            {gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}  >

          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"

              onChange={handleChange('file')}
            />
            <Fab
              color="primary"
              size="small"
              component="span"
              aria-label="add"
              variant="extended"
            >
              <AddIcon /> Upload Image
            </Fab>

          </label>

        </Grid>
        <Grid item xs={12}>     <Button onClick={signupHandler} variant="contained" color="primary" fullWidth>
          SignUp
        </Button>
        </Grid>
      </Grid>
    </form>

  );
}

export default withRouter(Register);