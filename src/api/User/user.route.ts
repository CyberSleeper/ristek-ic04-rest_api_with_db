import express from 'express'
import * as controller from './user.controller'
import { isAuthenticated } from '../../middlewares/middleware';

const urlRoutes = express.Router();

urlRoutes.post('/', isAuthenticated, controller.createArticle);
urlRoutes.get('/', isAuthenticated, controller.getArticles);
urlRoutes.get('/:id', isAuthenticated, controller.getArticleById);
urlRoutes.put('/:id', isAuthenticated, controller.updateArticle);
urlRoutes.delete('/:id', isAuthenticated, controller.deleteArticle);

export default urlRoutes