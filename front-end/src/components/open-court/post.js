import React from 'react';
import {CardActions,Card, CardHeader,CardContent, Typography, IconButton,Avatar} from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ReplyIcon from '@material-ui/icons/Reply';
import { withStyles } from "@material-ui/core/styles";

const userStyles = theme =>({
    root:{
        maxWidth:1000,
        minWidth:800,
        marginBottom:10,
    },
});

export class Post extends React.Component{
    /* All info in the state should be collected form db */
    // state={
    //     content:"Posting content",
    //     author:"author",
    //     authorProfile: require("../../lib/profile/profilePic.png"),
    //      likes:,
    //      dislikes:
    // };

    render(){
        const {postInfo} = this.props;
        // const classes = userStyles();
        const {classes} = this.props;
        return (
            <div>
                <Card className={classes.root}>
                    <CardHeader
                        //avatar={
                        //    <Avatar src ={postInfo.AuthorProfile}/>
                        //}
                        title={postInfo.Author}
                        subheader = {postInfo.PostTime}
                    >
                    </CardHeader> 
                    <CardContent>
                        <Typography variant ="body1" color="textSecondary">
                            {postInfo.Content}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton>
                            <ThumbUpAltIcon/>
                            <Typography color="textSecondary">{postInfo.Likes}</Typography>
                        </IconButton>
                        <IconButton>
                            <ThumbDownAltIcon/>
                            <Typography color="textSecondary">{postInfo.Dislikes}</Typography>
                        </IconButton>
                        <IconButton>
                            {/**TODO: onlick to reply the post */}
                            <ReplyIcon/>
                        </IconButton>
                    </CardActions>
                </Card>
            </div>
        )
    }

}
export default withStyles(userStyles)(Post);