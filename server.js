var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号\nnode server.js 8888 像这样!')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个请求过来啦！路径（带查询参数）为：' + pathWithQuery)
    if (path === '/') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html;charset=utf-8');
        response.write(`
         <!DOCTYPE html>
         <html lang="zh-CN">

         <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <meta http-equiv="X-UA-Compatible" content="ie=edge">
         <title>画线</title>
            <link rel="stylesheet" href="/x" >
        </head>

        <body>
            <canvas id="canvas"></canvas>
            <script src="/y"></script>
        </body>
        </html>
        `);
        response.end();
    } else if (path === '/x') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/css;charset=utf-8');
        response.write(`
          *{padding:0;margin:0;box-sizing:border-box;}
          #canvas{display:block;}
          `);
        response.end();
    } else if (path === '/y') {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8');
        response.write(`
                    let canvas = document.getElementById('canvas');
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green"
        ctx.lineCap = "round"
        ctx.lineWidth = 4

        function drawLine(x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        let painting = false;
        let last


        let isTouchDevice = 'ontouchstart' in document.documentElement;
        if (isTouchDevice) {
            canvas.ontouchstart = function (e) {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                last = [x, y]
            }
            canvas.ontouchmove = function (e) {
                // let x = e.touches[0].clientX;
                // let y = e.touches[0].clientY;
                // ctx.beginPath();
                // ctx.arc(x, y, 10, 0, 2 * Math.PI);
                // ctx.fill();

                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                drawLine(last[0], last[1], x, y);
                last = [x, y]
            }
        } else {
            canvas.onmousedown = function (e) {
                painting = true;
                last = [e.clientX, e.clientY]
            }
            canvas.onmousemove = function (e) {
                if (painting === true) {
                    // ctx.beginPath();
                    // ctx.arc(e.clientX, e.clientY, 10, 0, 2 * Math.PI);
                    // ctx.fill();

                    drawLine(last[0], last[1], e.clientX, e.clientY)
                    last = [e.clientX, e.clientY]
                }
            }
            canvas.onmouseup = function () {
                painting = false;
            }
        }
            `);
        response.end();
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你输入的路径不存在对应的内容`)
        response.end()
    }
    // if (path === '/') {
    //     response.statusCode = 200
    //     response.setHeader('Content-Type', 'text/html;charset=utf-8')
    //     response.write(`Hello\n`)
    //     response.end()
    // } else if (path === '/x') {
    //     response.statusCode = 200
    //     response.setHeader('Content-Type', 'text/css;charset=utf-8')
    //     response.write(`body{color: red;}`)
    //     response.end()
    // } else {
    //     response.statusCode = 404
    //     response.setHeader('Content-Type', 'text/html;charset=utf-8')
    //     response.write(`你输入的路径不存在对应的内容`)
    //     response.end()
    // }

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

