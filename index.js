const config = require("./config.json");
const Discord = require("discord.js");
const got = require("got");
const ytdl = require('ytdl-core');

const tr = {"id": config.tr_client_id, "secret": config.tr_secret};
const giphyApi = "f5B4qAqleMEj7SV7H30EQDiAyyZwPfhp";
//const music = require("discord.js-music-v11");
//hi
const bot = new Discord.Client({disableEveryone: true});

const errors = ["잘못된 구문입니다. //help를 입력해서 명령어 목록을 확인하세요.", "필요한 파라미터 수보다 많거나, 적습니다.", "잘못된 파라미터입니다."];

const cheerio = require('cheerio');
var request = require('request');
let url = "https://playentry.org/api/rankProject?type=staff&limit=3&noCache=1535458594330";
let pData = [];
let logs = [];
let swear = ["시발", "씨발", "ㅅㅂ", "ㅆㅂ", "병신", "ㅄ", "ㅂㅅ", "개새", "ㄳㄲ", "ㄱㅅㄲ"];
swear.push("존나", "ㅈㄴ", "졸라", "븅신", "섹스", "색스", "섹", "느금마", "느개비", "ㄴㄱㅁ", "ㄴㄱㅂ");
swear.push("뒤져", "뒈져", "디져");

var express = require('express');
var app = express();
var client_id = '246vhJODV7fPR7NYdME0';//개발자센터에서 발급받은 Client ID
var client_secret = 'okg9_Vt2OG'; //개발자센터에서 발급받은 Client Secret

bot.on("ready", async () => {
  console.log(`${bot.user.username} ON!`);
  bot.user.setGame("//help");
});

bot.on("message", async message => {
  if(message.author.bot) return; //봇이 아닌 유저인 경우 체크
  if(message.channel.type === "dm") return;
  if(message.content.substring(0, 2) != config.prefix) return; //접두사가 맞는지 체크

  let prefix = config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let mention = message.author;
  let allArgs = message.content.replace(cmd + " ", "");
  let allSArgs = message.content.replace(messageArray[0] + " " + messageArray[1] + " ", "");
  let urlEncode = encodeURI(allArgs);
  let urlSEncode = encodeURI(allSArgs);

  let d = new Date();

  console.log(`${message.author} used "${message.content}" - Time ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
  logs.push(`${message.author} used "${message.content}" - Time ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);

  //music(bot, {
  	//prefix: "//",     // Prefix of '-'.
  	//global: false,   // Server-specific queues.
  	//maxQueueSize: 10, // Maximum queue size of 10.
  	//clearInvoker: true // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
  //});

  switch (cmd) {
    case `${prefix}help`: //help
      const hprofileIMG = bot.user.displayAvatarURL;
      var embed = new Discord.RichEmbed()
      .setTitle("NYS Bot Commands")
      .setDescription("NYS Bot Commands")
      .setColor("#2478FF")
      .setThumbnail(hprofileIMG)
      .addField(`${prefix}help`, "도움말을 확인합니다.")
      .addField(`${prefix}info`, "니스봇의 정보를 확인합니다.")
      .addField(`${prefix}say <말할 것>`, "말할 것을 말합니다.")
      .addField(`${prefix}pick <첫번째 숫자> [두번째 숫자]`, "1부터 첫번째 숫자 중 하나의 숫자를 뽑거나 첫번째 숫자부터 두번째 숫자 중 하나의 숫자를 뽑습니다.")
      .addField(`${prefix}sp`, "엔트리 스태프 선정 작품을 실시간으로 확인합니다.")
      .addField(`${prefix}pp`, "엔트리 인기작품을 실시간으로 확인합니다.")
      .addField(`${prefix}log`, "NYS Bot의 로그를 확인합니다. (log 명령어는 logs로 사용 가능합니다.)")
      .addField(`${prefix}s help`, "검색 도움말을 확인합니다.");
      return message.channel.send(embed);
      break;

    case `${prefix}info`: //봇 정보
      const iprofileIMG = bot.user.displayAvatarURL;
      var embed = new Discord.RichEmbed()
      .setTitle("NYS Bot Information")
      .setDescription("NYS Bot Information")
      .setColor("#2478FF")
      .setThumbnail(iprofileIMG)
      .addField("Name", bot.user.username)
      .addField("Developer", "NYANGI")
      .addField("Development start date", bot.user.createdAt)
      .addField("Development Language", "Javascript")
      .addField("Hosting", "Heroku")
      .addField("Invite Link", "https://discordapp.com/oauth2/authorize?client_id=472572874192977930&scope=bot&permissions=bot");
      return message.channel.send(embed);
      break;

    case `${prefix}say`: //말하기
      if (messageArray.length > 1) {
        return message.channel.send(allArgs);
      } else {
        errorPrint(1);
      }
      break;

    case `${prefix}pick`:
      if(messageArray.length < 4 && messageArray.length > 1) {

        if(messageArray.length == 2) {
          let num1 = parseInt(messageArray[1]);
          return message.channel.send(mention + " 1부터 " + num1 + "중 뽑힌 숫자 : " + (parseInt(Math.random()*num1) + 1));
        } else {
          let num2 = parseInt(messageArray[1]);
          let num3 = parseInt(messageArray[2]);
          return message.channel.send(mention + " " + num2 + "부터 " + num3 + "중 뽑힌 숫자 : " + (parseInt(Math.random()*(num3 - num2 + 1)) + num2));
        }

      } else {
        errorPrint(1);
      }
      break;

    case `${prefix}sp`:
    url = "https://playentry.org/api/rankProject?type=staff&limit=3";
    request(url, function(error, response, html){
    if (error) {throw error};
      const uObj = JSON.parse(html);
      pData = [];
      for (var i = 0; i < 3; i++) {
        pData.push({username: uObj[i].project.user.username,name: uObj[i].project.name,visit: uObj[i].project.visit,like: uObj[i].project.likeCnt,comment: uObj[i].project.comment, shortenUrl: uObj[i].project.shortenUrl});
      }
      var embed = new Discord.RichEmbed()
      .setTitle("Entry Staff Picks")
      .setDescription("엔트리 실시간 스태프 선정 작품")
      .setColor("#2478FF")
      .addField(pData[0].name, `개발자 ${pData[0].username} | 조회수 ${pData[0].visit} | 좋아요 ${pData[0].like}개 | 댓글 ${pData[0].comment}개 | [Click here](${pData[0].shortenUrl})`)
      .addField(pData[1].name, `개발자 ${pData[1].username} | 조회수 ${pData[1].visit} | 좋아요 ${pData[1].like}개 | 댓글 ${pData[1].comment}개 | [Click here](${pData[1].shortenUrl})`)
      .addField(pData[2].name, `개발자 ${pData[2].username} | 조회수 ${pData[2].visit} | 좋아요 ${pData[2].like}개 | 댓글 ${pData[2].comment}개 | [Click here](${pData[2].shortenUrl})`);
      return message.channel.send(embed);
    });
    break;

    case `${prefix}pp`:
    url = "https://playentry.org/api/rankProject?type=best&limit=9";
    request(url, function(error, response, html){
    if (error) {throw error};
      const pObj = JSON.parse(html);
      pData = [];
      for (var j = 0; j < 9; j++) {
        pData.push({username: pObj[j].project.user.username,name: pObj[j].project.name,visit: pObj[j].project.visit,like: pObj[j].project.likeCnt,comment: pObj[j].project.comment, shortenUrl: pObj[j].project.shortenUrl});
      }
      var embed = new Discord.RichEmbed()
      .setTitle("Entry Popular Projects")
      .setDescription("엔트리 실시간 인기작품")
      .setColor("#2478FF")
      .addField(pData[0].name, `개발자 ${pData[0].username} | 조회수 ${pData[0].visit} | 좋아요 ${pData[0].like}개 | 댓글 ${pData[0].comment}개 | [Click here](${pData[0].shortenUrl})`)
      .addField(pData[1].name, `개발자 ${pData[1].username} | 조회수 ${pData[1].visit} | 좋아요 ${pData[1].like}개 | 댓글 ${pData[1].comment}개 | [Click here](${pData[1].shortenUrl})`)
      .addField(pData[2].name, `개발자 ${pData[2].username} | 조회수 ${pData[2].visit} | 좋아요 ${pData[2].like}개 | 댓글 ${pData[2].comment}개 | [Click here](${pData[2].shortenUrl})`)
      .addField(pData[3].name, `개발자 ${pData[3].username} | 조회수 ${pData[3].visit} | 좋아요 ${pData[3].like}개 | 댓글 ${pData[3].comment}개 | [Click here](${pData[3].shortenUrl})`)
      .addField(pData[4].name, `개발자 ${pData[4].username} | 조회수 ${pData[4].visit} | 좋아요 ${pData[4].like}개 | 댓글 ${pData[4].comment}개 | [Click here](${pData[4].shortenUrl})`)
      .addField(pData[5].name, `개발자 ${pData[5].username} | 조회수 ${pData[5].visit} | 좋아요 ${pData[5].like}개 | 댓글 ${pData[5].comment}개 | [Click here](${pData[5].shortenUrl})`)
      .addField(pData[6].name, `개발자 ${pData[6].username} | 조회수 ${pData[6].visit} | 좋아요 ${pData[6].like}개 | 댓글 ${pData[6].comment}개 | [Click here](${pData[6].shortenUrl})`)
      .addField(pData[7].name, `개발자 ${pData[7].username} | 조회수 ${pData[7].visit} | 좋아요 ${pData[7].like}개 | 댓글 ${pData[7].comment}개 | [Click here](${pData[7].shortenUrl})`)
      .addField(pData[8].name, `개발자 ${pData[8].username} | 조회수 ${pData[8].visit} | 좋아요 ${pData[8].like}개 | 댓글 ${pData[8].comment}개 | [Click here](${pData[8].shortenUrl})`);
      return message.channel.send(embed);
    });
    break;

    case `${prefix}s`:
    case `${prefix}search`:
      if(messageArray.length == 2 && messageArray[1] == "help") {
        var embed = new Discord.RichEmbed()
        .setTitle("NYS Bot Search Commands")
        .setDescription(`NYS Bot Search Commands [접두사 's'는 'search'로 사용 가능합니다. 예) ${prefix}s naver 니스봇 = ${prefix}search naver 니스봇]`)
        .setColor("#2478FF")
        .addField(`${prefix}s help`, "검색 도움말을 확인합니다.")
        .addField(`${prefix}s naver <검색어>`, "네이버 검색을 합니다.")
        .addField(`${prefix}s google <검색어>`, "구글 검색을 합니다.")
        //.addField(`${prefix}s entry <검색어>`, "엔트리 작품 검색을 합니다.")
        //.addField(`${prefix}s entryc <검색어>`, "엔트리 커뮤니티 검색을 합니다.")
        .addField(`${prefix}s gif <검색어>`, "랜덤 GIF(Giphy) 검색을 합니다.");
        return message.channel.send(embed);
      } else {
        if(messageArray.length > 2) {
          switch(messageArray[1]) {
            case "naver":
              return message.channel.send(`${mention} "${allSArgs}"에 대한 네이버 검색 결과 :\n\n[https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${urlSEncode}]`);
              break;

            case "google":
              return message.channel.send(`${mention} "${allSArgs}"에 대한 구글 검색 결과 :\n\n[https://www.google.co.kr/search?safe=active&source=hp&ei=AIGKW7jMNs3l-AbD0puQCw&q=${urlSEncode}]`);
              break;

            case "gif":
              const gres = await got(`https://api.giphy.com/v1/gifs/random?api_key=${giphyApi}&tag=${urlSEncode}`, {json: true});
              const embed = new Discord.RichEmbed()
              .setDescription(`${allSArgs}에 대한 Giphy 검색 결과`)
              .setImage(gres.body.data.image_url)
              .setAuthor(message.author.tag, message.author.displayAvatarURL);

              return message.channel.send(embed);
              break;
          }
        }
      }

    case `${prefix}tr`:
    var query = "반갑습니다.";
    app.post('/translate', function (req, res) {
      var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
      var request = require('request');
       var options = {
           url: api_url,
           form: {'source':'ko', 'target':'en', 'text':query},
           headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
        };
       request.post(options, function (error, response, body) {
         if (!error && response.statusCode == 200) {
           res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
           res.end(body);
         } else {
           res.status(response.statusCode).end();
           console.log('error = ' + response.statusCode);
         }
       });
     });
     app.listen(3000, function () {
       console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
     });
     //app.listen(3000, function () {
     //});
      break;

    case `${prefix}log`:
    case `${prefix}logs`:
    var embed = new Discord.RichEmbed()
    .setTitle("NYS Bot View Logs")
    .setDescription("NYS Bot의 최신 로그들을 확인합니다.")
    .addField("──────────", logs[logs.length - 6])
    .addField("──────────", logs[logs.length - 5])
    .addField("──────────", logs[logs.length - 4])
    .addField("──────────", logs[logs.length - 3])
    .addField("──────────", logs[logs.length - 2]);

    return message.channel.send(embed);
    break;

    case `${prefix}m`:
    const voiceChannel = message.member.voiceChannel;
    switch (messageArray[1]) {
      case "play":
      if(!voiceChannel) return message.channel.send('죄송합니다. 음성채널에 입장해주세요');
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if(!permissions.has('CONNECT')) {
        return message.cheannel.send('저에게 음성채널에 들어갈 권한이 없습니다.');
      }
      if(!permissions.has('SPEAK')) {
        return message.channel.send('저에게 음성채널에서 음악을 틀 권한이 없습니다.');
      }

      try {
        var connection = await voiceChannel.join();
      } catch (error) {
        console.error(`I could not join the voice channel - ${error}`);
        return message.channel.send(`I could not join the voice channel - ${error}`);
      }

      const dispatcher = connection.playStream(ytdl(allArgs))
        .on('end', () => {
          console.log('song ended!');
          voiceChannel.leave();
        })
        .on('error', error => {
          console.error(error);
        });
      dispatcher.setVolumeLogarithmic(5 / 5);
        break;

      default:
        errorPrint(3);
    }

    break;

    default: //구문이 잘못된 경우
      errorPrint(0);
  }


  function errorPrint(num) { //:warning:
    const erembed = new Discord.RichEmbed()
    .setTitle(":warning: Error!")
    .setDescription(errors[num])
    .setColor("#ED0000")
    .setAuthor(message.author.tag, message.author.displayAvatarURL);
    return message.channel.send(erembed);
  }

});

bot.login(config.token);
