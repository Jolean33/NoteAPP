const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const placeName = ["Firstselects","Secondselects","Thirdselects","Fourthselects","Fifthselects","Sixthselects","Seventhselects","Eighthselects"];//ここは関係ないです。
let data = [];
let JoelsSQL;
app.use('/', express.static(path.join(__dirname, '/')));//ファイルを表示

app.use(bodyParser.json({
  limit: '200mb'
}));

async function connectMysql() { 
  try {
     JoelsSQL = await mysql.createConnection({//MySQLの初期設定
      host: 'localhost',
      user: 'root',
      password: 'JoelSQL',
      database: 'programNoteSQL'
    });
    //await JoelsSQL.beginTransaction();//ここをコメントでなくすると、なぜか、下のadd処理とdelete処理が動作しなくなる。
  } catch (err) { 
    console.log('error connecting: ' + err.stack);
  }
}

//サーバー側
app.post('*/api/get_note_data', (req, res, next) => {
  (async()=>{//中でawaitを使いたいからasyncで囲む
   await connectMysql();
    let json = req.body;
  switch(json.P)//送られてくたjsonデータの [P] の中に入っている文字列で、何の処理をするのか決める
  {
    case "add"://新しいボタンを追加
      await JoelsSQL.query('INSERT INTO Note (id,class,btext,atext,born,place) VALUES(?,?,?,?,?,?)',[json.id,json.class,json.btext,json.atext,json.born,json.place]);
      res.send({OK:true});
    break;

    case "delete"://ボタンを削除
      await JoelsSQL.query(`DELETE FROM Note WHERE class LIKE "%${json.id}fordelet%" OR id = ?`,[json.id]);
      res.send({OK:true});
    break;

    case "get"://フロントにSQLのすべての情報を渡す。フロント側では、このアプリを起動したとき、一番最初にここでSQLの情報を取得して、ボタンを追加していく。まだ完成していないーーーーーーーー
      data = [];
      let dataFlag = [];
      for(let i = 0;i < 8;i++)
      {
        [dataFlag] = await JoelsSQL.query('SELECT * FROM Note WHERE place = ?',placeName[i]);
        data.push(dataFlag[0]);
      }
      res.send({jsonData:data});
      break;

    
  }
  })();
  
});

app.listen(3000);
