import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({ message: `Server listening at http://localhost:${PORT}` })
});

const PORT = 8080;

app.listen(PORT,  () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});