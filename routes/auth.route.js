const express = require("express");

const authControllers = require("../controllers/auth.controller");

const routes = express.Router();

routes.post('/signup', authControllers.signup);
routes.post('/login', authControllers.login);

module.exports = routes;
