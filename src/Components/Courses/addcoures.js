import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AddIcon from "@material-ui/icons/Add";
import { Fab, Button } from "@material-ui/core";
import { Add } from '../../Store/auth';
import { toast } from 'react-toastify';


const useStyles = makeStyles((theme) => ({
  testfiles:
  {
    margin: '2rem auto'
  },
  addButton:
  {

    backgroundColor: '#cddc39',

  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = (props) => {



  const notify = (type) => toast.error(type, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,

  });
  const notify2 = (type) => toast.success(type, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,

  });




  const [values, setValues] = React.useState({
    title: '',
    pref: '',
    desc: '',
    price: '',
    image: '',



  });




  const handleChange = (prop) => (event) => {

    if (prop === 'file') {
      if (event.target.files.length === 3) {

        setValues({ ...values, image: event.target.files });
        notify2('Images Has Been Added');

      }
      else
        notify('Please Select Three Images!');

    }
    else
      setValues({ ...values, [prop]: event.target.value });
  };




  const addHandler = async (event) => {
    event.preventDefault();
    if (values.title === '' || values.pref === ''
      || values.desc === '' || values.price === ''
      || values.image === '')

      notify('Please Fill All Fileds!');

    else {

      const respons = await Add(values)
      if (respons === 'Somthing Went Wrong!')
        notify('Somthing Went Wrong!')
      else
        notify2('Your Data Has Been Added Successfully')


      setValues({
        title: '',
        pref: '',
        desc: '',
        price: '',
        image: ''
      });

      props.Reload();
      handleClose();

    }
  }



  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" className={classes.addButton} onClick={handleClickOpen}>
        Add New Coures
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Adding New Course
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} direction="column" xs={12} >
          <form   >
            <Grid item xs={10} className={classes.testfiles} >   <TextField id="Title" label="Title" type='text' fullWidth onChange={handleChange('title')} value={values.title} /></Grid>
            <Grid item xs={10} className={classes.testfiles}>    <TextField id="Brief" label="Brief Description" fullWidth type='text' value={values.pref} onChange={handleChange('pref')} /></Grid>
            <Grid item xs={10} className={classes.testfiles} >    <TextField
              id="Description"
              label="Description" fullWidth
              multiline
              rows={4}
              value={values.desc} onChange={handleChange('desc')}
            />

            </Grid>
            <Grid item xs={10} className={classes.testfiles} >    <TextField id="price" label="Price" fullWidth type='number' value={values.price} onChange={handleChange('price')} /></Grid>


            <Grid item xs={10} className={classes.testfiles}>

              <label htmlFor="upload-photo">
                <input
                  style={{ display: "none" }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  multiple
                  onChange={handleChange('file')}
                />
                <Fab
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="add"
                  variant="extended"
                >
                  <AddIcon /> Upload Images
                </Fab><sub><pre> **Select three images at once</pre></sub>

              </label>

            </Grid>
            <Grid item xs={10} className={classes.testfiles}>

              {/* <Button onClick={signupHandler} variant="contained" color="primary" fullWidth>
          Add
        </Button> */}
              <Button fullWidth
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                onClick={addHandler}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          </form>
        </Grid>
      </Dialog>
    </div>
  );
}


export default FullScreenDialog;