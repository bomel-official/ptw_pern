"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = require("express");
const db_1 = require("./db");
const models = require('./models/core');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Routes
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express_1.default.json());
app.use(fileUpload({}));
app.use('/api', router);
app.use('/static', express_1.default.static('static'));
app.use(errorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.Database.authenticate();
        yield db_1.Database.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
start();
