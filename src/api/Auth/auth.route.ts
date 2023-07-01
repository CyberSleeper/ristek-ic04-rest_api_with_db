import express from 'express'
import * as controller from './auth.controller'

const urlRoutes = express.Router();

urlRoutes.post('/register', controller.registerUser);
urlRoutes.post('/login', controller.loginUser);
urlRoutes.post('/refreshToken', controller.refreshUser);

export default urlRoutes