import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import NewsCards from "./Components/NewsCards/NewsCards";
import icon from "./Assets/icon.png";

const alanKey = process.env.REACT_APP_ALAN_KEY;

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (article) {
            window.open(article.url, "_blank");
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className="header">
        <img className="icon" src={icon} alt="icon" />
        <h1 className="heading">NewsEra</h1>
      </div>

      <NewsCards activeArticle={activeArticle} articles={newsArticles} />
    </div>
  );
};

export default App;
