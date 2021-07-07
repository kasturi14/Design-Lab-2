const http = require('http');
const app = require('./backend/app');

//to make sure the port is a valid number
const normalizePort = val => {
    var port = parseInt(val, 10);
    if(isNaN(port)) {
        return val;
    }
    if(port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || "3000");

app.set('port', port); // tells express the port we are working
const server = http.createServer(app);

server.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
 });
