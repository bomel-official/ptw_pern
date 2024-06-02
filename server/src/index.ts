import "@types";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import "module-alias/register";
import "tsconfig-paths/register";
import { getEnv } from "./core/libs";
import { Database } from "./db";
import { errorHandlingMiddleware } from "./middleware";
import { router } from "./routes";

require( "dotenv" ).config();

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
