'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');

const HOST = 'api.line.me';
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = ''; //Channel Secretを指定
const CH_ACCESS_TOKEN = ''; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = 3000;

var text2 = {
    "type": "flex",
    "altText": "aaa" + "さんを褒めましたか？",
    "contents": {
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
                {
                    "type": "text",
                    "text": "kkkk" + "さんを褒めましたか？",
                    "wrap": true,
                    "weight": "bold",
                    "gravity": "center",
                    "align": "center",
                    "size": "xl"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "xxl",
                    "spacing": "md",
                    "contents": [{
                        "type": "button",
                        "style": "primary",
                        "color": "#0984E3",
                        "action": {
                            "type": "postback",
                            "label": "褒めた",
                            "data": 'check1&' + "kkkk" + "&褒めた",
                            "displayText": "lllll" + "さんを褒めた",
                        }
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "color": "#FD79A8",
                        "action": {
                            "type": "postback",
                            "label": "褒めてない",
                            "data": 'check1&' + "lll" + "&褒めてない",
                            "displayText": "jjjj" + "さんを褒めてない",
                        }
                    }]
                }
            ]
        }
    }
}

/**
 * httpリクエスト部分
 */
const client = (replyToken, SendMessageObject) => {
    let postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: REPLY_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(body);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};

http.createServer((req, res) => {
    if (req.url !== '/' || req.method !== 'POST')
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('');
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        if (body === '')
        {
            console.log('bodyが空です。');
            return;
        }

        let WebhookEventObject = JSON.parse(body).events[0];
        //メッセージが送られて来た場合
        if (WebhookEventObject.type === 'message')
        {
            let SendMessageObject;
            if (WebhookEventObject.message.type === 'text')
            {
                SendMessageObject = [
                    text2
                ];
            }
            client(WebhookEventObject.replyToken, SendMessageObject)
                .then((body) => {
                    console.log(body);
                }, (e) => { console.log(e) });
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('success');
    });

}).listen(PORT);

console.log(`Server running at ${PORT}`);