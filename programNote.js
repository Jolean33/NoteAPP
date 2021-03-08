$(() => {
    let nowPlace = $("#Firstselects");//今表されている階層のidを入れる
    let startID = [];//親のIDを入れる
    let AREflag = false;//削除ボタン、プラスボタン、編集ボタンのホバーに必要
    let AREcolor = "";//削除ボタン、プラスボタン、編集ボタンの色を入れる
    let PlaceOBNumber = 0;
    let PlaceOB = [{ color: "yellow", PlaceName: "Firstselects", thisLine: "YellowLine", last: false },
    { color: "blue", PlaceName: "Secondselects", underLine: "#YellowLine", thisLine: "BlueLine", ShowButtonID: "", last: false },
    { color: "green", PlaceName: "Thirdselects", underLine: "#BlueLine,#YellowLine", thisLine: "GreenLine", ShowButtonID: "", last: false },
    { color: "red", PlaceName: "Fourthselects", underLine: "#GreenLine,#BlueLine,#YellowLine", thisLine: "RedLine", ShowButtonID: "", last: false },
    { color: "olive", PlaceName: "Fifthselects", underLine: "#GreenLine,#BlueLine,#YellowLine,#RedLine", thisLine: "OliveLine", last: false },
    { color: "teal", PlaceName: "Sixthselects", underLine: "#GreenLine,#BlueLine,#YellowLine,#RedLine,#OliveLine", thisLine: "TealLine", last: false },
    { color: "lime", PlaceName: "Seventhselects", underLine: "#GreenLine,#BlueLine,#YellowLine,#RedLine,#OliveLine,#TealLine", thisLine: "LimeLine", last: false },
    { color: "fuchsia", PlaceName: "Eighthselects", underLine: "#GreenLine,#BlueLine,#YellowLine,#RedLine,#OliveLine,#TealLine,#LimeLine", thisLine: "FuchsiaLine", last: true }];//階層のデータを配列としていれる
    let nowPlaceandPlace;//クリックされたボタンのIDを入れる
    let nowscreen = "B";//newButtonがBでnewTextがAとして入れておく
    let Text = "";//新規ボタンやテキスト画面に記載された文字列を取得
    let longText = "";//大きい入力欄のテキストを入れる
    let removeButtonFlag = false;//マイナスボタンが押されていたらtrue、押されていなかったらfalse
    let EditButtonFlag = false;//編集ボタンが押されていたらtrue、押されていなかったらfalse
    let removeButtonID;//マイナスボタンがクリックされたボタンのIDを入れておいて、警告画面でOKが押されたらこのIDを消す
    let CloseButtonIN;
    let serverJsonData;
    const url = "/api/get_note_data";
    const buttonSet = function(selectar)//ボタンに必要なイベントを一気に追加できる関数
    {
        selectar.hover(function () {//ボタンのホバー
            if (!(removeButtonFlag) && !(EditButtonFlag)) {
                colorChange($(this), 2);
                colorChange($(this).find("input"), 2);
                $(this).css("color", "black");
                $(this).find("input").css("color", "black");
            }
        }, function () {
            if (!(removeButtonFlag) && !(EditButtonFlag)) {
                $(this).css("background-color", "black");
                $(this).css("color", "white");
                $(this).find("input").css("color", "white");
                $(this).find("input").css("background-color", "black");
            }
        });
        selectar.click(function () {//選択肢をクリックした時にその階層の選択肢を消して、一つ上の階層を表示する
            if (!(removeButtonFlag) && !(EditButtonFlag))//マイナスボタンと編集ボタンが押されていない時だけ
            {
                if (!($(this).hasClass("Text"))) {
                    if(nowPlace.attr("id") == "Seventhselects") {$("#A").click();}//最後の階層に行ったら、新しいメモを追加するボタンをオンにしておく。
                    startID.push($(this).attr("id"));//クリックされたボタンのIDを入れておく。
                    PlaceOBNumber++;//階層を一つ上げる
                    if ("Firstselects" != nowPlace.attr("id").toString()) { ClassChenge($("." + nowPlaceandPlace), "show", "close", "close"); } else { ClassChenge($("#Firstselects").find("li"), "show", "close", "close"); }
                    nowPlaceandPlace = $(this).attr("id");
                    PlaceChange(true);
                } else {
                    $("#AdditionalScreenBlock,#TextshowBox").fadeIn(500);
                    ClassChenge($(`#${$(this).attr("id")}Text,#CloseButton`), "show", "close", "show");
                    $("#EditButton").addClass("EditButtonS").css("color", "black");
                    AREcolor = "black";
                    CloseButtonIN = "Text";
                }
            }

        });
        selectar.find("div").click(function () {//マイナスボタンがクリックされたボタンのidを取っておく。そして、警告画面を出す。
            ClassChenge($("#warningButtons").find(".ON"), "ON", "OFF", "OFF");
            $("#warningScreen,#AdditionalScreenBlock").fadeIn(500);
            removeButtonID = $(this).parent("li").attr("id");
        });
        selectar.find("div").hover(function () {//マイナスボタンがクリックされたボタンのホバー
            colorChange($(this), 0);
        }, function () {
            $(this).css("color", "white");
        });
    }
    const ClassChenge = (selectar, ClassA, ClassB, CS) => {//消したり表示したりするのを簡単にできるようにする関数。
        if (CS == ClassB) {
            selectar.removeClass(ClassA).addClass(ClassB);
        } else {
            selectar.removeClass(ClassB).addClass(ClassA);
        }
    }
    const colorChange = function (selectar, con) {//イベントをいちいち追加しなくても色を変えられるようにする関数
        switch (con) {
            case 0:
                selectar.css("color", PlaceOB[PlaceOBNumber].color);
                break;
            case 1:
                selectar.css("border-color", PlaceOB[PlaceOBNumber].color);
                break;
            case 2:
                selectar.css("background-color", PlaceOB[PlaceOBNumber].color);
                break;
        }
    }
    const placecolorSet = function()//階層が変わったときに、いろんな物の色を変える
    {
        colorChange($("#B,#A,#Binput,#Ainput"), 1);//入力欄、入力欄を変更するボタンの色を変える
        colorChange($("#warningScreen").find("p"), 0);//警告画面の文字の色を変える
        colorChange($("#warningScreen").find("p"), 1);//警告画面のborderの色を変える
        colorChange($("#TextshowBox").find("textarea"), 1);//Text画面のborderの色を変える//編集ボタンが押されていないとき
    }
    const PlaceChange = function (LineShoworClose) {//ボタンをクリックしたときに、階層を変える
        ClassChenge(nowPlace, "show", "close", "close");//前の階層を隠す
        nowPlace = PlaceOB[PlaceOBNumber].PlaceName;//階層のidを取得
        if (LineShoworClose) { ClassChenge($(PlaceOB[PlaceOBNumber].underLine), "show", "close", "show"); ClassChenge($("." + nowPlaceandPlace), "show", "close", "show"); PlaceOB[PlaceOBNumber].ShowButtonID = nowPlaceandPlace; }//その階層の中に入っている階層を表示
        else { ClassChenge($("#SelectLines").find(".show"), "show", "close", "close"); ClassChenge($(PlaceOB[PlaceOBNumber].underLine), "show", "close", "show"); ClassChenge($("." + PlaceOB[PlaceOBNumber].ShowButtonID), "show", "close", "show"); nowPlaceandPlace = PlaceOB[PlaceOBNumber].ShowButtonID; }//戻るボタンを消すか表示するか
        nowPlace = $("#" + nowPlace);//jQueryオブジェクトとして階層の入れる
        ClassChenge(nowPlace, "show", "close", "show");//次の階層を表示
        placecolorSet();//いろんな物の色を変更
        //console.log("関数内 = " + nowPlace.attr("id"));
        //console.log(PlaceOBNumber);
        //console.log(PlaceOBNumber + " = " + PlaceOB[PlaceOBNumber].ShowButtonID);
    }

    ClassChenge($(".ql-toolbar"),"close","show","close");
    const server = function(data,DataType)//サーバーと通信する関数。
    {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json; charset=UTF-8");
        // サーバーにリクエストを出す
        fetch(url, {
            method: "POST",
            headers: myHeaders,
            body: data,
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('ERR!whats a fucking ERR!');
            }
            return res.json();

        }).then((json) => {
            
            if(DataType)//trueだったらget処理だから、もらったデータをどんどんHTMLに追加していく。falseだったら、addかdelete処理だから、とりあえずデータが送られてきたかだけチェックする。
            {
                //console.log(json);
                for(let i = 0;i < 8;i++)
                {
                    nowPlace = $("#" + PlaceOB[i].PlaceName);
                    for(let u = 0;u < json.jsonData[i].length;u++)
                    {
                        console.log(json);
                        addButtonorNote(json.jsonData[i][u].id , json.jsonData[i][u].class , json.jsonData[i][u].btext , json.jsonData[i][u].atext , "" , json.jsonData[i][u].born , false);
                        buttonSet($("#" + json.jsonData[i][u].id));
                    }
                }  
                nowPlace = $("#Firstselects");//上のfor文で階層をいじっているので、元に戻す。
                ClassChenge(nowPlace.find("li"),"show","close","show");
            }else{
                if(!json.OK) console.log("err! can't receive from server!");
            }
            
        }).catch((err) => {
            console.log(err);
        });
    }

    server(JSON.stringify({P:"get"}),true);//関数を実行（テスト用）





    function addButtonorNote(ID, Class, Btext, Atext, deleteID, BorN/*falseでボタン,trueでメモ*/,save/*falseでSQLに保存しない,trueで保存する*/)//ボタンやメモを追加された時に実行される関数。
    {
        console.log("ID = " + ID);
        nowPlace.find("ul").append(`<li id="${ID}" class="close ${Class}"><input maxlength="32" type="text" value=${Btext} readonly><div class="close"><i class="fas fa-minus"></i></div></li>`);//上の階層のid名をclassに追加
        if (BorN) {
            $(`#${ID}`).addClass("Text");
            $("#TextshowBox").append(`<textarea id="${ID}Text" class="close" readonly>${Atext}</textarea>`);
        }
        
        if(save)//サーバー側に新しく追加したボタンの情報を渡すーーーーーーーーーーーここでサーバーに追加したボタンやメモのデータを送るーーーーーーーーーーーーーーーーーーー
        {
            for (let i = 0; deleteID.length > i; i++)//新しく追加したボタンとTEXTのCLASSに削除用の文字列を追加。
            {
                $(`#${ID}`).addClass(`${deleteID[i]}fordelet`);//ボタンい削除用のクラスを追加
                if (BorN) { $(`#${ID}Text`).addClass(`${deleteID[i]}fordelet`); }//メモに削除用のクラスを追加
            }
            server(JSON.stringify(//サーバーに情報を送る

            {//送るjsonデータ
            P:"add" //この中に入っている文字列で、サーバー側が何の処理をするのか決める。addだと、データをSQLに追加する処理をする。

            , id:ID //新しく追加したボタン、メモのid

            , class:`${$(`#${ID}`).attr("class")}` //新しく追加したボタン、メモのclass

            , btext:Btext //新しく追加したボタン、メモの題名

            , atext:Atext //新しく追加物がメモだったら、この中に、メモが入る

            , born:BorN //メモかボタンかを true か false　で表す

            , place:`${nowPlace.attr("id")}`//新しく追加されたボタン、メモの階層の名前を入れておく

            }),false);
        }else{
            $(`#${ID}Text`).addClass(Class);//サーバーから送られてきたclassデータは、fordeletとかも全部書いてあるから、saveがtrueの時みたいにいちいち追加する必要がないからここで一気に追加しちゃうぜ
        }
    }
    ///////////////////////////////////////////////////
    $("#B").css("background-color", "DimGray");
    $(".fa-angle-up").hide();
    ///////////////////////////////////////////////////
    $("#CrossBlock").click(() => {//新しいボタンなどを追加する画面の✖️ボタンを押した時
        $("#AdditionalScreenBlock,#AdditionalScreen").fadeOut(500);
        $("#Binput,#Ainput").val("");
    });
    ///////////////////////////////////////////////////
    $("#zoomButton").hover(function () {//大きい入力欄をズームするボタンのホバー
        colorChange($(this), 0);
    }, function () {
        $(this).css("color", "black");
    });
    $("#zoomButton").click(function () {//大きい入力欄をズームするボタンのクリック
        $("#AdditionalScreen").css("z-index", 4);//ここーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
        $("#Ainput").addClass("zoom");
        CloseButtonIN = "Ainput";
        ClassChenge($("#CloseButton"), "show", "close", "show");
    });
    ///////////////////////////////////////////////////
    $("#CloseButton").hover(function () {//大きい入力欄がズームされている時に出てくる✖️ボタンのホバー
        if (!EditButtonFlag) colorChange($(this), 0);//編集ボタンが押されていない時だけ
    }, function () {
        $(this).css("color", "black");
    });
    $("#CloseButton").click(function () {////大きい入力欄がズームされている時に出てくる✖️ボタンが押されたときの処理
        switch (CloseButtonIN) {
            case "Ainput":
                $("#Ainput").removeClass("zoom");
                ClassChenge($("#CloseButton"), "show", "close", "close");
                break;
            case "Text":
                if (!EditButtonFlag) {//編集ボタンが押されていない時だけ
                    $("#AdditionalScreenBlock,#TextshowBox").fadeOut(500);
                    ClassChenge($(`#${$("#TextshowBox").find(".show").attr("id")},#CloseButton`), "show", "close", "close");
                    $("#EditButton").removeClass("EditButtonS").css("color", "white");
                    AREcolor = "white";
                }
                break;
        }

    });
    ///////////////////////////////////////////////////
    buttonSet($("#selecs").find("li"));///すべてのボタンに必要なイベントを一気に追加
    placecolorSet();//階層の色を設定
    ///////////////////////////////////////////////////
    $("#EditButton").click(function () {//編集ボタンを押したときの処理
        if (!(removeButtonFlag)) {
            if (EditButtonFlag) {
                EditButtonFlag = false;
                $(this).css("color", AREcolor);
                nowPlace.find("input").prop('readonly', true).css("cursor", "default").css("border", "none");
                $("#TextshowBox").find(".show").prop('readonly', true).css("cursor", "default").css("border", `solid 5px ${PlaceOB[PlaceOBNumber].color}`);
            } else {
                EditButtonFlag = true;
                colorChange($(this), 0);
                if ($("#TextshowBox").find(".show").hasClass("show")) {//メモを開いている時は、そのメモだけを編集可能にする
                    $("#TextshowBox").find(".show").prop('readonly', false).css("cursor", "text").css("border", "solid 10px white").focus();
                } else {
                    nowPlace.find("input").prop('readonly', false).css("cursor", "text").css("border", "solid 5px white").focus();
                }
            }
        }
    });
    ///////////////////////////////////////////////////
    $("#addButton").click(() => {//プラスボタンを押した時の処理
        if (!(removeButtonFlag) && !(EditButtonFlag))//マイナスボタンが押されていないきだけ
        {
            $("#AdditionalScreenBlock,#AdditionalScreen").fadeIn(500);
            ClassChenge($("#OKbutton"), "ON", "OFF", "OFF");
            colorChange($("#OKbutton"), 2);
        }
    })
    ///////////////////////////////////////////////////
    $("#addButton,#removeButton,#EditButton").hover(function () {//プラスボタンとマイナスボタンを押したときのホバーの処理
        if (!(removeButtonFlag || EditButtonFlag)) { colorChange($(this), 0); AREflag = true; } else { AREflag = false; }
    }, function () {
        if (AREflag && !(removeButtonFlag || EditButtonFlag)) {
            $(this).css("color", AREcolor);
        }
    });
    ///////////////////////////////////////////////////
    $("#CrossBlock").hover(function () {//新しいボタンやテキストを追加する画面のバツボタン
        colorChange($(this), 0);
    }, function () {
        $(this).css("color", "black");
    });
    $("#removeButton").click(function () {//マイナスボタンを押した時の処理。
        if (!(EditButtonFlag)) {
            if (removeButtonFlag) {
                ClassChenge(nowPlace.find("div"), "show", "close", "close");
                nowPlace.find("input").css("width","98%");
                removeButtonFlag = false;
                $(this).css("color", "white");
            } else {
                ClassChenge(nowPlace.find("div"), "show", "close", "show");
                nowPlace.find("input").css("width","90%");
                removeButtonFlag = true;
                colorChange($(this), 0);
            }
        }
    });
    ///////////////////////////////////////////////////
    $("#YESButton").click(function () {//警告画面のYESボタンをクリックしたときの処理
        ClassChenge($(this), "ON", "OFF", "ON");
        $(`#${removeButtonID},.${removeButtonID}fordelet,#${removeButtonID}Text`).remove();//ボタンを削除する。removeButtonIDは削除するボタンのid
        console.log("削除したいボタンの情報をサーバーに送信しました。");
        server(JSON.stringify({P:"delete" , id:removeButtonID}),false);//削除したいボタンの情報をserverにおくる
        $("#warningScreen,#AdditionalScreenBlock").fadeOut(500);
    });
    $("#NOButton").click(function () {//警告画面のNOボタンをクリックしたときの処理
        ClassChenge($(this), "ON", "OFF", "ON");
        $("#warningScreen,#AdditionalScreenBlock").fadeOut(500);
    });
    ///////////////////////////////////////////////////
    $("#B").click(() => {//newButtonをクリックしたときに小さい入力欄を出す
        if ($("#B").hasClass("OFF")) {
            ClassChenge($("#B"), "ON", "OFF", "ON");
            ClassChenge($("#A"), "ON", "OFF", "OFF");
            //ClassChenge($("#Binput"),"show","close","show");
            ClassChenge($("#Ainput,#zoomButton,.ql-toolbar").val(""), "show", "close", "close");
            $("#Binput").val("");
            $("#B").css("background-color", "DimGray");
            $("#A").css("background-color", "black");
            //console.log("Bclick");
            if(PlaceOB[PlaceOBNumber].last) {$("#OKbutton").find("p").text("Can't add.");}
            nowscreen = "B";
        }
    });
    $("#A").click(() => {//newTextをクリックしたときに大きい入力欄を出す
        if ($("#A").hasClass("OFF")) {
            ClassChenge($("#B"), "ON", "OFF", "OFF");
            ClassChenge($("#A"), "ON", "OFF", "ON");
            ClassChenge($("#Ainput,#zoomButton,.ql-toolbar"), "show", "close", "show");
            //ClassChenge($("#Binput").val(""),"show","close","close");
            $("#Binput").val("");
            $("#A").css("background-color", "DimGray");
            $("#B").css("background-color", "black");
            //console.log("Aclick");
            if(PlaceOB[PlaceOBNumber].last) {$("#OKbutton").find("p").text("OK");}
            nowscreen = "A";
        }
    });

    ///////////////////////////////////////////////////

    $("#OKbutton").click(() => {//addscreenのOKボタンを押した時の処理（ボタン、メモを追加したときの処理
        if ($("#Binput").val() != "" && (PlaceOB[PlaceOBNumber].last == false || (PlaceOB[PlaceOBNumber].last == true && nowscreen == "A")))//AinputかBinputのどちらかでも何か入力されていたら、実行
        {
            let Aflag = false;
            longText = "";
            Text = "";
            if (nowscreen === "B") {
                Text = $("#Binput").val();
            } else {//入力欄のテキストを変数に代入
                Text = $("#Binput").val();
                longText = $("#Ainput").val();
                Aflag = true;
            }

            let newButtonID = "";
            let nowButtonshow = [];//今表示されているボタンのidを入れる変数（配列）
            let randomTextIn = "";
            const randomTextlength = 5;//ランダム生成する文字列の長さ
            const randomText = "abcdefghijklmnopqrstuvwxyz";
            const randomTextL = randomText.length;
            let flag = false;
            ClassChenge($("#OKbutton"), "ON", "OFF", "ON");
            $("#AdditionalScreenBlock,#AdditionalScreen").fadeOut(500);
            $("#Binput,#Ainput").val("");
            nowPlace.find(".show").each(function (index, element) {//表示されているボタンのidを配列にいれる！！
                nowButtonshow.push($(element).attr("id").substr(-4, 4));
            });
            while (true)//ランダムな文字列を作成する。
            {
                flag = false;
                for (let i = 0; i < randomTextlength; i++) { randomTextIn += randomText[Math.floor(Math.random() * randomTextL)]; }
                for (let i = 0; i < nowButtonshow.length; i++) {
                    if (nowButtonshow[i] == randomTextIn) { flag = true; break; }
                }
                if (!(flag)) break;
            }
            if (nowPlace[0] != $("#Firstselects")[0]) {
                newButtonID = nowPlaceandPlace + randomTextIn;//作成したランダムな文字列をidにして、この階層の親のidとくっつける
                addButtonorNote(newButtonID, nowPlaceandPlace, Text, longText, startID, Aflag,true);//ボタン、メモをHTMLに追加する関数を実行この関数は、同時にサーバー側にもデータを送る
                ClassChenge($(`#${newButtonID}`), "show", "close", "show");
            } else {//もし一番最初の階層だったら（黄色の階層）
                newButtonID = randomTextIn;//作成したランダムな文字列をidにする。
                addButtonorNote(newButtonID, "", Text, longText, startID, Aflag,true);//ボタン、メモをHTMLに追加する関数を実行。この関数は、同時にサーバー側にもデータを送る
                ClassChenge($(`#${newButtonID}`), "show", "close", "show");
            }
            buttonSet($(`#${newButtonID}`));//新しいボタンにイベントを追加
            colorChange($("#TextshowBox").find("textarea"), 1);//メモが追加されたときは、これでtextareaの色を今の階層の色に変えておく
        }
    });

    ///////////////////////////////////////////////////


    $("#SelectLines").find("li").click(function () {//戻るボタンを押した時の処理。
        if(nowPlace.attr("id") == "Eighthselects") {$("#OKbutton").find("p").text("OK");}//最後の階層から戻るボタンを押した場合、okボタンのテキストを変える。
        if (!(removeButtonFlag) && !(EditButtonFlag)) {//マイナスボタンが押されていない時だけ
            let con = 0;
            PlaceOB.find((A) => {
                con++;
                return $(this).attr("id") == A.thisLine;
            });
            PlaceOBNumber = con - 1;
            for (let i = 0; startID.length != PlaceOBNumber; startID.pop());
            //console.log(startID);
            ClassChenge($("#selecs").find("ul").find(".show"), "show", "close", "close");
            PlaceChange(false);
            if ("Firstselects" == nowPlace.attr("id").toString()) ClassChenge($("#Firstselects").find("li"), "show", "close", "show");
        }
    });
    $("#SelectLines").find("li").hover(function() {//戻るボタンのホバー
    if (!(removeButtonFlag) && !(EditButtonFlag)) {
        $(this).css("background-color",`${$(this).css("border-color")}`); 
        $(this).find("i").css("color", "black");
    }
    },function(){
    if (!(removeButtonFlag) && !(EditButtonFlag)) {
        $(this).css("background-color", "black");
        $(this).find("i").css("color", "white");
    }
    });
});
