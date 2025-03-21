if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config({ path: `${__dirname}/../.env` });
  }
  const {nanoid}=require("nanoid");
  const mongoose = require("mongoose");
  const { resolve, reject } = require('promise');
  const { MongoClient, ServerApiVersion } = require("mongodb");
  
  const client = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
async function generateShortUrl(req,res)
{
    try {
        await client.connect();
        const db = client.db("UrlShortnerInfo");
        const coll = db.collection("UrlShortnerInfo");
        const body=req.body;
        const existingEntry = await coll.findOne({ redirectURL: body.url });
        if(!body.url)return res.status(400).json({error:'url is required'});
        if (existingEntry) {
            // If the URL exists, return the existing shortID
            return res.json({ id: existingEntry.shortID });
        }
        const shortID =nanoid(8);
        await coll.insertOne({
        shortID:shortID,
        redirectURL:body.url,
        visitHistory:[],
    });
    return res.json({id:shortID});
      } 
      catch (err)
        {
        console.log(err);
        return err;
        }
     finally 
      {
        await client.close();
      }
}


async function generateUrl(req, res) {
  try {
      await client.connect();
      const db = client.db("UrlShortnerInfo");
      const coll = db.collection("UrlShortnerInfo");

      const  shortID = req.body.shortid;
    // Capture shortID from URL parameters
      if (!shortID) return res.status(400).json({ error: 'Short ID is required' });

      // Find the original URL corresponding to the shortID
      const entry = await coll.findOne({ shortID: shortID });

      if (!entry) {
          return res.status(404).json({ error: 'Short URL not found' });
      }

      // Optionally, update the visit history
      await coll.updateOne(
          { shortID: shortID },
          { $push: { visitHistory: { timestamp: Date.now() } } }
      );

      // Redirect the user to the original URL
      return res.redirect(entry.redirectURL);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
  } finally {
      await client.close();
  }
}


module.exports={generateShortUrl,generateUrl
};