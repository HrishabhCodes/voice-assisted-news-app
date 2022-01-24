import React, { useState, useEffect, createRef } from "react";
import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import "./NewsCard.css";
import classNames from "classnames";

const NewsCard = ({
  article: { description, publishedAt, source, title, url, urlToImage },
  i,
  activeArticle,
}) => {
  const [elemRefs, setElemRefs] = useState([]);
  const scrollToRef = (ref) => {
    window.scroll(0, ref.current.offsetTop - 50);
  };

  useEffect(() => {
    setElemRefs((refs) => {
      Array(20)
        .fill()
        .map((_, index) => refs[index] || createRef());
    });
  }, []);

  useEffect(() => {
    if (i === activeArticle && elemRefs[activeArticle]) {
      scrollToRef(elemRefs[activeArticle]);
    }
  }, [i, activeArticle, elemRefs]);

  return (
    <Card
      ref={elemRefs[i]}
      className={classNames("card", activeArticle === i ? "activeCard" : null)}
    >
      <CardActionArea href={url} target="_blank">
        <CardMedia
          className="media"
          image={
            urlToImage ||
            "https://www.industry.gov.au/sites/default/files/August%202018/image/news-placeholder-738.png"
          }
        />
        <div className="details">
          <Typography variant="body2" color="textSecondary" component="h2">
            {new Date(publishedAt).toDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="h2">
            {source.name}
          </Typography>
        </div>
        <Typography className="title" gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="cardActions">
        <Button size="small" color="primary" href="">
          Learn More
        </Button>
        <Typography variant="h5" color="textSecondary" component="h2">
          {i + 1}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
