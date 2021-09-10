import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Logo from '../../Assets/Images/logo.png'
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';

const useStyles = makeStyles((theme) => ({

    images:
    {
        width: "2rem",
        marginRight: '1rem'
    },
    img:
    {
        width: "11rem"
    },
    header:
    {
        backgroundColor: '#5a4d69',
        // height: "6rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"

    },
    root: {

        flexGrow: 1,
        height: "6rem",

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" >
                <Grid container spacing={2} direction="column" className={classes.header}>
                    <Grid item sm={12} md={2}>
                        <p><PhoneAndroidIcon />  0789165865</p>
                        <p><LocationOnIcon /> Amman,Jordan</p>
                    </Grid>
                    <Grid item sm={12} md={2} >
                        <img src={Logo} alt="Logo" className={classes.img} />
                    </Grid>
                    <Grid item sm={12} md={2}>
                        <InstagramIcon className={classes.images} />
                        <YouTubeIcon className={classes.images} />
                        <TwitterIcon className={classes.images} />
                        <FacebookIcon className={classes.images} />
                    </Grid>
                </Grid>
            </AppBar>
        </div>
    );
}

export default Footer;