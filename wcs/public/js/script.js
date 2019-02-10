  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBq4vED4vtEbf8rP8O-1SKrdOtTMVlkjW4",
    authDomain: "chatapp-f02d4.firebaseapp.com",
    databaseURL: "https://chatapp-f02d4.firebaseio.com",
    projectId: "chatapp-f02d4",
    storageBucket: "chatapp-f02d4.appspot.com",
    messagingSenderId: "675337792817"
  };
  firebase.initializeApp(config);

  // MSG送信準備
  const newPostRef = firebase.database();
  let room = "hamayoo_room";

  const username = document.getElementById("username");
  const output = document.getElementById("output");

  // MSG送信処理
  // send.addEventListener('click', function(){
  //   newPostRef.ref(room).push({
  //     username: username.value,
  //     text: text.value,
  //     time: time()
  //   });
  //   text.value = "";
  // });

  // MSG受信処理
  function text() {
    newPostRef.ref(room).on("child_added", function(data){
      const v = data.val();
      const k = data.key;
      let str = "";
      str += '<div id="' + k + '" class="msg_main">'
      str += '<div class="msg_left">';
      str += '<div class=""><img src="img/icon_person.png" alt="" class="icon ' + v.username + '"width="30"></div>';
      str += '<div class="msg">';
      str += '<div class="name">' + v.username + '</div>';
      str += '<div class="text">' + v.text + '</div>';
      str += '</div>';
      str += '</div>';
      str += '<div class="msg_right">';
      str += '<div class="time">' + v.time + '</div>'; 
      str += '</div>';
      str += '</div>';
      
      output.innerHTML += str;

      $("#output").scrollTop($("#output")[0].scrollHeight);
    });
  }

  // 時間取得
  function time() {
    var date = new Date();
    var hh = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var sec = ("0" + date.getSeconds()).slice(-2);
    var time = hh + ":" + min + ":" + sec;
    return time;
  }

  /*---------------- 音声認識処理 ----------------*/
  const speech = new webkitSpeechRecognition();
  speech.lang = 'ja-JP';

  // イベント
  const join = document.getElementById('join');
  // const btn = document.getElementById('btn');
  const content = document.getElementById('content');

  join.addEventListener('click', function(){
    room = document.getElementById('join-room').value;
    // 音声認識スタート
    speech.start();
    text();
  });

  // END CALL
  const endcall = document.getElementById('end-call');
  endcall.addEventListener('click', function(){
    location.reload();
  });

  // 自動音声文字起こし
  speech.onresult = function(e) {
    speech.stop();
    if(e.results[0].isFinal) {
      var autotext = e.results[0][0].transcript
      console.log(e);
      console.log(autotext);
      newPostRef.ref(room).push({
        username: username.value,
        text: autotext,
        time: time()
      });
    }
  }
  speech.onend = () => {
    speech.start()
  };