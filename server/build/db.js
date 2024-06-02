"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const { Sequelize } = require('sequelize');
exports.Database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});
