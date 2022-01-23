import React from "react";
import NewsCard from "./NewsCard/NewsCard";
import { Grid, Typography } from "@mui/material";
import Grow from "@mui/material/Grow";
import "./NewsCards.css";

const NewsCards = ({ articles }) => {
  return (
    <Grow in>
      <Grid className="container" container alignItems="stretch" spacing={3}>
        {articles.map((article, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} style={{ display: "flex" }}>
            <NewsCard article={article} i={i} />
          </Grid>
        ))}
      </Grid>
    </Grow>
  );
};

export default NewsCards;
