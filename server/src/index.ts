import express from 'express';
import { StatusDatabase } from './database/status-database';

// Setup databse related variables - Can be passed in if containerzied
process.env.DATABASE = process.env.DATABASE ? process.env.DATABASE : "localhost:5432";
process.env.DATABASE_NAME = process.env.DATABASE_NAME ? process.env.DATABASE_NAME : "test_db";

const app = express();
const port = 3000; // default port to listen

const statusDatabase = new StatusDatabase();
statusDatabase.startDatabase();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );