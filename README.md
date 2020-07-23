# Status Gov Healthcheck Application
This application monitors various different websites and records their uptimes / downtimes up to
a 1 week period. It allows users to quickly check the current status and response time latency of
different websites

## Setting up locally
For local development, please install the latest versions of node and postgres. In postgres, you must create
a database called test_db.
To run the Angular stack:\
`cd client`\
`npm install`\
`npm run start`\
Navigate to localhost:5206

To run the NodeJS stack, please make sure you have postgres up first.\
`cd server`\
`npm install`\
`npm run start`

A docker compose file is also setup for starting up the backend stack of this application. Starting the server
through docker container will not require postgres running on local machine. To start backend using docker:\
`cd server`\
`docker-compose up -d`\
You may then follow instructions on starting the Angular application.
