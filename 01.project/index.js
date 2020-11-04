const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync('Home.html', 'utf-8');
const fetch = require('node-fetch')
const express = require('express');
const { static } = require('express');

let app = express()
let port = 9000

//set public directory
app.use(express.static('public'))

const replaceVal = (tempVal, orgVal) => {
    let tempereture = tempVal.replace('{%tempval%}', orgVal.main.temp);
    tempereture = tempereture.replace('{%humidity%}', orgVal.main.humidity);
    tempereture = tempereture.replace('{%tempmaxval%}', orgVal.main.temp_max);
    tempereture = tempereture.replace('{%location%}', orgVal.name);
    tempereture = tempereture.replace('{%country%}', orgVal.sys.country);
    return tempereture;
}

app.get('/', async (req, res) => {
    try {
        res.writeHead(200, { "content-type": "text/html" })
        const fetch_url = await fetch("http://api.openweathermap.org/data/2.5/weather?q=Jalandhar,%20IN&APPID=92b5f550214dd4ab9ba1aff91d2f9f0e")
        const fetch_json = await fetch_url.json()
        const arrData = [fetch_json];
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData)
        res.end()

    } catch (error) {
        console.log(error);
        res.writeHead(404)
        res.write("error occured")
    }
})

app.listen(port, () => { console.log(`running at ${port}`); })


// const server = http.createServer(async (req, res) => {
//     if (req.url == '/') {
//         



//         // requests("http://api.openweathermap.org/data/2.5/weather?q=Jalandhar,%20IN&APPID=92b5f550214dd4ab9ba1aff91d2f9f0e")
//         //     .on('data', (chunk) => {
//         //         const objData = JSON.parse(chunk);
//         //         const arrData = [objData];
//         //         // console.log(arrData);
//         //         // console.log(arrData[0].main.temp);
//         //         const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
//         //         res.writeHead(200, {
//         //             'Content-Type': 'text/html'
//         //         });
//         //         res.write(realTimeData);
//         //         return res.end();

//         //     })
//         //     .on('error', (err) => {
//         //         res.writeHead(404);
//         //         res.end(err)
//         //     })


//     }
// })
// server.listen(9000, () => { console.log('running'); });