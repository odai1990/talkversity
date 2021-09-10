import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import FullScreenDialog from './addcoures';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { red, blue, green } from "@material-ui/core/colors";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import { Get, Delete } from '../../Store/auth';
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles({
  imgHeader:
  {
    width: '100%',
    height: '31rem',
    margin: '0 0 -4rem',
    padding: '0',
},
  
  card:
  {
    width: '100%'
  },
  cardDesc: {
    height: '4rem'
  },
  imgInDialgo:
  {
    maxWidth: '100%',
    width: '100%',
    height: 'inherit'
  },
  dialog:
  {
    margin: '7rem auto 0',
  },
  root: {
    maxWidth: 345,
    margin: '3rem auto 3rem',
    backgroundColor: "#e0e0e0"
  },
  media: {
    height: '13rem',
  },
});

const Courses = () => {
  const classes = useStyles();
  const data = useSelector(state => state);


  const [handleOpen, setHandleOpen] = useState({
    open: false,
    im1: '',
    img2: '',
    img3: '',
    title: '',
    desc: ''
  });



  const [coureses, setCoureses] = useState([]);
  useEffect(() => {
    getDatahandler()
  }, []);

  const getDatahandler = async () => {
    setCoureses(await Get())
  }

  const handleClick = (data) => {
    setHandleOpen({
      open: true,
      img1: data.img1,
      img2: data.img2,
      img3: data.img3,
      title: data.title,
      desc: data.desc
    });
  };



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


  const deleteHandler = async (data, index) => {

    const respons = await Delete(data)
    if (respons === 'Somthing Went Wrong!')
      notify('Somthing Went Wrong!')
    else
      notify2(respons)

    let tempContent = [...coureses]
    tempContent.splice(index, 1)
    setCoureses(tempContent)

  };



  const AutoRotatingCarouselModal = ({ handleOpen, setHandleOpen, isMobile }) => {
    return (
      <div>

        <AutoRotatingCarousel
          label="Close"
          open={handleOpen.open}
          onClose={() => setHandleOpen({ open: false })}
          onStart={() => setHandleOpen({ open: false })}
          autoplay={true}
          mobile={isMobile}
          
          style={{ position: "absolute" }}
        >
          <Slide
            media={
              <img src={handleOpen.img1} alt="Course" className={classes.imgInDialgo} />
            }
            mediaBackgroundStyle={{ backgroundColor: red[400] }}
            style={{ backgroundColor: red[600] }}
            title={handleOpen.title}
            subtitle={handleOpen.desc}
          />
          <Slide
            media={
              <img src={handleOpen.img2} alt="Course" className={classes.imgInDialgo} />
            }
            mediaBackgroundStyle={{ backgroundColor: blue[400] }}
            style={{ backgroundColor: blue[600] }}
            title={handleOpen.title}
            subtitle={handleOpen.desc}
          />
          <Slide
            media={
              <img src={handleOpen.img3} alt="Course" className={classes.imgInDialgo} />
            }
            mediaBackgroundStyle={{ backgroundColor: green[400] }}
            style={{ backgroundColor: green[600] }}
            title={handleOpen.title}
            subtitle={handleOpen.desc}
          />
        </AutoRotatingCarousel>
      </div>
    );
  };


  const matches = useMediaQuery("(max-width:600px)");
  return (
    <Grid item container xs={12} direction="column" >

      <AutoRotatingCarouselModal
        isMobile={matches}
        handleOpen={handleOpen}
        setHandleOpen={setHandleOpen}
      />

      <Grid item container xs={12} >
      <img className={classes.imgHeader} src='https://www.interpermhealthcare.uk/wp-content/uploads/2020/06/Trainingcourses.jpg'/>
      </Grid>
      <Grid item container xs={12} justifyContent='center' className={classes.dialog} >
        {data.role === '1' ? <FullScreenDialog Reload={getDatahandler} /> : null}
      </Grid>
      <Grid item container xs={12}>

        {coureses.map((info, index) => {

          return (
            <Grid item md={6} sm={12} xs={12} lg={3} key={index} className={classes.card}>
              <Card className={classes.root} >
                <CardActionArea >
                  <CardMedia
                    className={classes.media}
                    image={info.img1}
                    title="Contemplative Reptile"
                  />
                  <CardContent className={classes.cardDesc}>
                    <Typography gutterBottom variant="h7" component="h2">
                      {info.title}
                    </Typography>
                    <Typography gutterBottom variant="body2" component="p">
                      ${info.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {info.pref}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions >

                  <Button size="small" color="primary" onClick={() => handleClick(info)}>
                    Show More
                  </Button>
                  {data.role === '1' ?
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteHandler(info._id, index)}
                    >
                      Delete
                    </Button> : null}
                </CardActions>
              </Card>
            </Grid>

          )
        })}
      </Grid>
    </Grid>
  );
}


export default Courses;