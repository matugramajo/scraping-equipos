import express from 'express';
import mongoose from 'mongoose';
import scrapeTeams from './scraping/scrapeTeams.js';

const app = express();
const port = 3001;

mongoose.connect('mongodb+srv://matildegramajo:OhCQx0CPL9Eb0h7L@argg.joybg.mongodb.net/ARGg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

  
  app.get('/api/scrape', async (req, res) => {
    try {
      const result = await scrapeTeams();
      res.json(result);
    } catch (error) {
      console.error('Error en el scraping:', error);
      res.status(500).json({ error: 'Hubo un error al realizar el scraping' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });