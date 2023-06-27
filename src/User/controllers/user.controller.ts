import { Request, Response } from "express";
import prisma from "../../../prisma/prisma";

export const getArticles = async (req: Request, res: Response) => {
  try {
    const items = await prisma.user.findMany();
    res.json(items);
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).send('Internal Server Error');
  }
}

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const items = await prisma.user.findMany({
      where: {
        id,
      },
    });
    res.json(items);
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).send('Internal Server Error');
  }
}

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body
    const newUser = await prisma.user.create({
      data: {
        title,
        content,
        tags,
      },
    });
    res.json(newUser);
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body
    const { id } = req.params

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        tags,
      },
    })

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    })

    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    })
  }
}