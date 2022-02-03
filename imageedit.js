const sharp = require("sharp");
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');

function randStr(l=10){
	let ch="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
	let r="";
	for(let i=0;i<l;i++){
		r+=ch[Math.floor(Math.random()*ch.length)];
	}
	return r;
}

const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg",(response)=>{
	fs.access("./temp/",fs.constants.F_OK,(err)=>{
		if(err){
			console.log("had to create the temp");
			fs.mkdir("temp",{},(err)=>{throw err;});
		}
	});
	
	let fileName=randStr();
	const file = fs.createWriteStream("temp/"+fileName+".jpg");
	
	response.pipe(file);
	 file.on('finish', () => {
        file.close();
        console.log(`File downloaded!`);
    });
});