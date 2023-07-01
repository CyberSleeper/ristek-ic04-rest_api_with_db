import express from 'express'
import * as controller from './auth.controller'

const urlRoutes = express.Router();

urlRoutes.post('/register', controller.registerUser);


export default urlRoutes