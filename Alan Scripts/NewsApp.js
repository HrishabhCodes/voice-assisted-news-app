intent(
  "What does this app do?",
  "What can I do here?",
  reply(
    'NewsEra is a news app which is completely voice controlled. You can search latest news by categories, terms and sources. Try saying: "Give me the latest technology news."'
  )
);

const newsKey = process.env.REACT_APP_NEWS_API_KEY;
const weatherKey = process.env.REACT_APP_WEATHER_API_KEY;
const aqiKey = process.env.REACT_APP_AQI_API_KEY;
let savedArticles = [];

// Weather Information

intent(
  `(tell me|what's|show me|) (the|) (temperature|weather) (of|in) $(place* (.+))`,
  (p) => {
    let WEATHER_URL = `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${p.place.value}&days=1&aqi=no&alerts=no`;
    let AQI_URL = `https://api.waqi.info/feed/${p.place.value}/?token=${aqiKey}`;
    let forecastInfo;
    api.request(WEATHER_URL, (err, response, body) => {
      const { location, current, forecast, error } = JSON.parse(body);
      if (error) {
        p.play("Sorry, please try searching for some other place.");
        return;
      }
      forecastInfo = {
        name: location.name,
        currTemp: current.temp_c,
        maxTemp: forecast.forecastday[0].day.maxtemp_c,
        minTemp: forecast.forecastday[0].day.mintemp_c,
        condition: current.condition.text,
      };
    });

    api.request(AQI_URL, (err, response, body) => {
      const { data, status } = JSON.parse(body);
      let aqi;
      if (status !== "error") {
        aqi = data.aqi;
      }
      p.play({ command: "weather", forecastInfo, aqi });
    });
  }
);

// News By Sources

intent(`(Give me| tell me| show me) the news from $(source* (.+))`, (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${newsKey}`;
  if (p.source.value) {
    NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value
      .toLowerCase()
      .split(" ")
      .join("-")}`;
  }
  api.request(NEWS_API_URL, (error, response, body) => {
    const { articles } = JSON.parse(body);

    if (!articles.length) {
      p.play("Sorry, please try searching for news from a different source.");
      return;
    }

    savedArticles = articles;

    p.play({ command: "newHeadlines", articles });
    p.play(`Here are the (latest|recent) news from ${p.source.value}.`);

    p.play("Would you like me to read all the headlines?");
    p.then(confirmation);
  });
});

// News By Terms

intent(
  `(read|show|get|bring me|give me|what's up) (the|) (news|articles) (with|on) $(term* (.+))`,
  (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${newsKey}`;
    if (p.term.value) {
      NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`;
    }
    api.request(NEWS_API_URL, (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for something else.");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });
      p.play(`Here are the (latest|recent) articles on ${p.term.value}.`);

      p.play("Would you like me to read all the headlines?");
      p.then(confirmation);
    });
  }
);

// News By Categories

const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
const CATEGORIES_INTENT = `${CATEGORIES.map(
  (category) => `${category}~${category}`
).join("|")}`;

intent(
  `(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}|) $(N news|headlines)`,
  (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${newsKey}&country=us`;
    if (p.C.value) {
      NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`;
    }
    api.request(NEWS_API_URL, (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for a different category.");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });

      if (p.C.value) {
        p.play(`(Here are the|) (latest|recent) articles on ${p.C.value}.`);
      } else {
        p.play(`Here are the (latest|recent) articles.`);
      }

      p.play("Would you like me to read the headlines?");
      p.then(confirmation);
    });
  }
);

const confirmation = context(() => {
  intent("yes", (p) => {
    for (let i = 0; i < savedArticles.length; i++) {
      p.play({ command: "highlight", article: savedArticles[i] });
      p.play(`${savedArticles[i].title}`);
    }
  });

  intent("no", (p) => {
    p.play("Sure, sounds good to me.");
  });
});

intent(`(Open|show) (the|) (article|news|) (number|) $(number* (.+))`, (p) => {
  if (p.number.value) {
    p.play({
      command: "open",
      number: p.number.value,
      articles: savedArticles,
    });
  }
});

intent(`(Go|) back!`, (p) => {
  p.play("Sure, going back...");
  p.play({ command: "newHeadlines", articles: [] });
});
