import { CustomRequest } from './../../middlewares/interface';
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

const findId = async (id: string) => {
  const item = await prisma.article.findMany({
    where: {
      id,
    },
  });
  return item
}

export const getArticles = async (req: Request, res: Response) => {
  try {
    const items = await prisma.article.findMany();
    res.status(200).json(items);
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).send('Internal Server Error');
  }
}

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const item = await findId(id);
    if(!item || item.length == 0) {
      res.status(404).json({message: "Article not found!"});
    } else {
      res.status(200).json(item);
    }
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).send('Internal Server Error');
  }
}

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body
    const newUser = await prisma.article.create({
      data: {
        title,
        content,
        tags,
      },
    });
    res.status(201).json(newUser);
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body
    const { id } = req.params

    const item = await findId(id);
    if(!item || item.length == 0) {
      res.status(404).json({message: "Article not found!"});
    } else {
      const updatedUser = await prisma.article.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          tags,
        },
      })
      res.status(200).json(updatedUser)
    }
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await findId(id);
    if(!item || item.length == 0) {
      res.status(404).json({message: "Article not found!"});
    } else {
      const deletedUser = await prisma.article.delete({
        where: {
          id,
        },
      })
      res.status(200).json(deletedUser)
    }
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}