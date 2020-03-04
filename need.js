'use strict';


var admin = require('firebase-admin');
var serviceAccount = require('./shiraga-bot-firebase-adminsdk-h4uqt-efae373928.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shiraga-bot.firebaseio.com"
    //データベースのURL
});


const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '',
    channelAccessToken: ''
};

var db = admin.database();
var ref = db.ref("line1");
var bt = db.ref("room");
var te = db.ref("users");

const app = express();

app.post('/', function (req, res) {
    connection.query('select * from test_table', function (error, results, fields) {
        if (error) throw error;
        res.send(results[0]);
    });
});



app.get('/', (req, res) => res.send('Hel LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff')
    {
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }

    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));

    // find(req.body.events)
});



function find(eve) {
    // console.log(eve)

    te.orderByChild('name').startAt('sato').endAt('sato').once('value', function (snapshot) { console.log(snapshot.val()) })
    // })
    // if (eve.source.userID == 'Ua2cae081021443730501c60a00a8a389')
    // {
    //     ref.on('value', (snapshot) => {
    //         console.log(snapshot)
    //     })
    // }
}

const client = new line.Client(config);



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



function handleEvent(event) {
    if (event.type == 'message')
    {
        aaa(event)

        return client.replyMessage(event.replyToken,


            [text2]

        );


    } else if (event.type == 'postback')
    {
        if ((event.postback.data).slice(-3) === '褒めた')
        {
            aaa(event)
            return client.replyMessage(event.replyToken, {
                "type": 'text',
                "text": '青色が押されました'
            });
        } else
        {
            aaa(event)
            return client.replyMessage(event.replyToken, {
                "type": 'text',
                "text": '赤色が押されました'
            });
        }
    }


};

function aaa(event) {

    if (event.type == 'message')
    {

        var nm = event.source.userId
        var ml = event.message.text
        var ag = event.message.id

        var data = { 'name': nm, 'message': ml, 'username': ag }

        bt.push({
            data
        });

    } else
    {
        sss()
        ref.push({
            event
        });

    }

}



function sss() {
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
    })
};


app.listen(PORT);
console.log(`Server running at ${PORT}`);