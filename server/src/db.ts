import { getEnv } from "./core/libs";

const { Sequelize } = require( "sequelize" );

export const Database = new Sequelize(
    getEnv( process.env.DB_NAME ),
    getEnv( process.env.DB_USER ),
    getEnv( process.env.DB_PASSWORD ),
    {
        dialect: "postgres",
        host: getEnv( process.env.DB_HOST ),
        port: parseInt( getEnv( process.env.DB_PORT ) )
    }
);
