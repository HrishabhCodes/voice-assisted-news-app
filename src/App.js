import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import NewsCards from "./Components/NewsCards/NewsCards";
import icon from "./Assets/icon.png";
import Footer from "./Components/Footer/Footer";

const alanKey = process.env.REACT_APP_ALAN_KEY;

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const [weatherInfo, setWeatherInfo] = useState({});

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number, forecastInfo, aqi }) => {
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
        } else if (command === "weather") {
          console.log(forecastInfo);
          console.log(aqi);
          setWeatherInfo({
            place: forecastInfo.name,
            temp: Math.round(forecastInfo.currTemp),
            high: Math.round(forecastInfo.maxTemp),
            low: Math.round(forecastInfo.minTemp),
            desc: forecastInfo.condition,
            air: aqi,
          });
        }
      },
    });
  }, []);

  return (
    <div className="app">
      <div className="main-cont">
        <div className="navbar">
          <div className="header">
            <img className="icon" src={icon} alt="icon" />
            <h1 className="heading">NewsEra</h1>
          </div>
          {!weatherInfo.place ? (
            <div className="weather-help">
              Try saying: <i> Temperature in New York!</i>
            </div>
          ) : (
            <div className="weather">
              <div className="temperature">
                <i className="temp-icon fa-solid fa-temperature-full"></i>
                <div className="cont">
                  <div className="value">{weatherInfo.temp}</div>
                  <div className="unit">°C</div>
                </div>
              </div>
              <div className="description">
                <div className="place">{weatherInfo.place}</div>
                <div className="condition">{weatherInfo.desc}</div>
                <div className="high-low">
                  <strong>↑</strong> {weatherInfo.high}° | <strong>↓</strong>{" "}
                  {weatherInfo.low}°
                  {!weatherInfo.air ? "" : `| AQI: ${weatherInfo.air}`}
                </div>
              </div>
            </div>
          )}
        </div>

        <NewsCards
          className="news-cards"
          activeArticle={activeArticle}
          articles={newsArticles}
        />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default App;
