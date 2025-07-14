// server.js
import express from 'express';
import amazonPaapi from 'amazon-paapi';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const credentials = {
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_ASSOCIATE_TAG,
  partnerType: 'Associates',
  marketplace: 'www.amazon.com', // or your marketplace
};

app.get('/api/products', async (req, res) => {
  try {
    const response = await amazonPaapi.searchItems({
      ...credentials,
      keywords: 'bestsellers',
      itemCount: 10,
    });

    const products = response.searchResult.items.map(item => ({
      title: item.itemInfo.title.displayValue,
      imageUrl: item.images?.primary?.medium?.url,
      price: item.offers?.listings?.[0]?.price?.displayAmount || 'N/A',
    }));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
