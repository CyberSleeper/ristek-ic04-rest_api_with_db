import { Request, Response } from "express";

export const getArticles = (req: Request, res: Response) => {
  res.status(302).json({message: "Articles found!"});
}

export const getArticleById = (req: Request, res: Response) => {
  res.status(302).json({message: "Article found!"});
}

export const createArticle = (req: Request, res: Response) => {
  res.status(201).json({message: "New article created!"});
}

export const updateArticle = (req: Request, res: Response) => {
  res.status(301).json({message: "Article updated!"});
}

export const deleteArticle = (req: Request, res: Response) => {
  res.status(202).json({message: "Article deleted!"});
}