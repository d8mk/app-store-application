const express = require("express");
const app = express();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const port = 3001;
const prisma = new PrismaClient();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const appStoreScraper = require("app-store-scraper");

app.get("/api/app/full-details", async (req, res) => {
  let { collection, category, country, lang, num } = req.query;

  collection = appStoreScraper.collection.TOP_FREE_IOS;

  try {
    const appDataFromDB = await prisma.App.findFirst({
      where: {
        collection: collection,
      },
    });

    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime - 60 * 60 * 1000);

    if (appDataFromDB) {
      if (appDataFromDB.updatedDate > oneHourAgo) {
        const allAppDataFromDB = await prisma.App.findMany({
          where: {
            collection: collection,
          },
        });
        const modifiedDataArray = allAppDataFromDB.map((obj) => {
          return {
            ...obj,
            id: obj.id.toString(),
          };
        });
        return res.json(modifiedDataArray);
      }
    }

    const appData = await appStoreScraper.list({
      collection,
      category,
      country,
      lang,
      num: 50,
      fullDetail: true,
    });

    for (const app of appData) {
      try {
        await prisma.App.upsert({
          where: {
            appId: app.appId,
          },
          create: {
            id: app.id,
            appId: app.appId,
            title: app.title,
            released: app.released,
            updated: app.updated,
            collection: appStoreScraper.collection.TOP_FREE_IOS,
          },
          update: {
            updated: app.updated,
            updatedDate: currentTime,
          },
        });

        console.log("Upsert successful");
      } catch (error) {
        console.error("Upsert error:", error);
      }
    }
    res.json(appData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/apps/ratings", async (req, res) => {
  try {
    const { id, appId, country = "us" } = req.query;
    const appRatings = await appStoreScraper.ratings({ id, appId, country });
    res.json(appRatings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching app ratings" });
  }
});

app.get("/api/apps/reviews", async (req, res) => {
  try {
    const {
      id,
      appId,
      country = "us",
      page = 1,
      sort = appStoreScraper.sort.HELPFUL,
    } = req.query;
    const appReviews = await appStoreScraper.reviews({
      id,
      appId,
      country,
      page,
      sort,
    });
    res.json(appReviews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching app reviews" });
  }
});

app.get("/api/apps/details", async (req, res) => {
  try {
    const { id, appId, country = "us" } = req.query;
    const appDetails = await appStoreScraper.app({ id, appId, country });
    res.json(appDetails);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching app details" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
