import express from 'express'
import * as controller from './user.controller'

const urlRoutes = express.Router();

urlRoutes.post('/', controller.createArticle);
urlRoutes.get('/', controller.getArticles);
urlRoutes.get('/:id', controller.getArticleById);
urlRoutes.put('/:id', controller.updateArticle);
urlRoutes.delete('/:id', controller.deleteArticle);

export default urlRoutes