const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync('Home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) =>{
    let tempereture = tempVal.replace('{%tempval%}',orgVal.main.temp);
    tempereture = tempereture.replace('{%humidity%}',orgVal.main.humidity);
    tempereture = tempereture.replace('{%tempmaxval%}',orgVal.main.temp_max);
    tempereture = tempereture.replace('{%location%}',orgVal.name);
    tempereture = tempereture.replace('{%country%}',orgVal.sys.country);
    return tempereture;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Jalandhar,%20IN&APPID=92b5f550214dd4ab9ba1aff91d2f9f0e")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData);
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
})
server.listen (9000,'127.0.0.1');