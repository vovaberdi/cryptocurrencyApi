import express from "express";
import config from "./config";
import cors from "cors";
import path from "path";


const server = express();
//handle cors
server.use(cors());
//use json as data type to send to the client
server.use(express.json());

//our Routes..

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//our middleware (handling error messages)
//if we didn't find any route, the server will run this command.

//show all the error messages
server.use("*", routeNotFound);
server.use("*", sumNotFoundError);
//catch all errors and show them to the user with the response message
server.use(catchAll);
server.listen(config.port, () => {
  console.log(`listening on http://localhost:${config.port}`);
});
