import express from 'express';
import { Request, Response } from 'express';
import userRouter from './src/api/User/user.route'
import authRouter from './src/api/Auth/auth.route'

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: `Server listening at http://localhost:${PORT}` })
});

const PORT = 8080;

app.listen(PORT,  () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});