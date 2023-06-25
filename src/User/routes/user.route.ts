import express from 'express'
import * as controller from '../controllers/user.controller'

const urlRoutes = express.Router();

urlRoutes.post('/', controller.createArticle);
urlRoutes.get('/', controller.getArticles);
urlRoutes.get('/:id', controller.getArticleById);
urlRoutes.get('/:id', controller.updateArticle);
urlRoutes.get('/:id', controller.deleteArticle);

module.exports = urlRoutes;