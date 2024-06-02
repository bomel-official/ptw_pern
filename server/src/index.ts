require( "dotenv" ).config();
import "module-alias/register";
import "tsconfig-paths/register";
import { JWTUserData } from "@core";
import { Database } from "@db";
import { getEnv } from "@libs";
import { errorHandlingMiddleware } from "@middleware";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { router } from "./routes";

declare global {
    namespace Express {
        export interface Request {
            user?: JWTUserData,
        }
    }
}

const PORT = getEnv( process.env.PORT ) || 5000;
const app = express();

// Routes
app.use( cors( {
    credentials: true, origin: getEnv( process.env.CLIENT_URL )
} ) );
app.use( express.json() );
app.use( fileUpload( {} ) );
app.use( "/api", router );
app.use( "/static", express.static( "static" ) );

app.use( errorHandlingMiddleware );

const start = async () => {
    try {
        await Database.authenticate();
        await Database.sync();
        app.listen( PORT,
            () => console.log( `Server started on port ${ PORT }` ) );
    } catch ( e ) {
        console.log( e );
    }
};

start();
