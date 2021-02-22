const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const placeName = ["Firstselects","Secondselects","Thirdselects","Fourthselects","Fifthselects","Sixthselects","Seventhselects","Eighthselects"];//ここは関係ないです。
let data = [];
app.use('/', express.static(path.join(__dirname, '/')));//ファイルを表示

app.use(bodyParser.json({
  limit: '200mb'
}));

const JoelsSQL = mysql.createConnection({//MySQLの初期設定
    host: 'localhost',
    user: 'root',
    password: 'JoelSQL',
    database: 'programNoteSQL'
});
JoelsSQL.connect((err) => {//MySQLへの接続ができなかったときのエラーを表示
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
});
async function GetQuery(i)
{
  return await JoelsSQL.query('SELECT * FROM Note WHERE place = ?',placeName[i]);
}

//サーバー側
app.post('*/api/get_note_data', (req, res, next) => {
  let json = req.body;
  switch(json.P)//送られてくたjsonデータの [P] の中に入っている文字列で、何の処理をするのか決める
  {
    case "add"://新しいボタンを追加
      JoelsSQL.query('INSERT INTO Note (id,class,btext,atext,born,place) VALUES(?,?,?,?,?,?)',[json.id,json.class,json.btext,json.atext,json.born,json.place],(error,results)=>{

        if(error) {console.log(error);}
        console.log(json.btext + "をSQLに保存しました。");
        
      });
    break;

    case "delete"://ボタンを削除
      JoelsSQL.query(`DELETE FROM Note WHERE class LIKE "%${json.id}fordelet%" OR id = ?`,[json.id],(error,results)=>{

        if(error) {console.log(error);}
        console.log(json.id + "を削除しました。");
      });
    break;

    case "get"://フロントにSQLのすべての情報を渡す。フロント側では、このアプリを起動したとき、一番最初にここでSQLの情報を取得して、ボタンを追加していく。まだ完成していないーーーーーーーー
      data = [];
      //let flag = [];
      for(let i = 0;i < 8;i++)
      {
        //[flag] = await JoelsSQL.query('SELECT * FROM Note WHERE place = ?',placeName[i]);

          //if(error) {console.log(error);}
          //console.log(flag);
          data.push(GetQuery(i));
          //console.log(i + " は " + data[i] + " です");//表示される
        
        //console.log(i + " は " + data[i] + " です");//ここにすると表示されない
      }
      console.log(data);
      res.send({jsonData:data});
      break;

    
  }
});

app.listen(3000);
