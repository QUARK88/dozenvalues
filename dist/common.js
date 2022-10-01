export function getJson(t){const i=new XMLHttpRequest;return i.open("GET","./dist/json/"+t+".json",!1),i.send(null),JSON.parse(i.responseText)}export function getLanguage(t){try{return getJson("ui-"+t)}catch(i){console.error(i),alert(t+" is not a valid language")}return getLanguage("en")}export function matchAxisTier(t,i){if(t<0||t>100||Number.isNaN(t))throw new Error(`Invalid score: ${t}%`);const s=[10,25,45,55,75,90,100];for(let e=0;e<s.length;e++){const l=s[e];if(t>=(s[e-1]??0)&&t<=l)return i[e]}throw new Error("Missing label")}export function orderScores(t,i,s){const e=t.length;for(const l of s){let s=0;for(let o=0;o<e;o++){const e=Math.abs(t[o]-l.stats[o]);s+=i[o]*Math.pow(e/100,3)}s/=e,l.score=s}return s.sort(((t,i)=>t.score-i.score)),s}export class Canvas{canvas;ctx;font;titleFont;bgColor;fgColor;constructor(t,i,s,e,l,o,n){this.canvas=t,this.canvas.width=i,this.canvas.height=s,this.ctx=this.canvas.getContext("2d"),this.font=e,this.titleFont=l,this.bgColor=n,this.fgColor=o,this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(0,0,i,s)}setFontsize(t){this.ctx.font=t.toFixed(0)+"px "+this.font}drawHeader(t,i,s,e){this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(0,0,this.canvas.width,180),this.ctx.fillStyle=this.fgColor,this.ctx.textAlign="start",this.ctx.font="64px "+this.titleFont,this.ctx.fillText(t,32,80,490),this.ctx.textAlign="end",this.setFontsize(16),this.ctx.fillText(i,768,48),this.ctx.fillText(s,768,80),this.ctx.textAlign="left",this.setFontsize(48),this.ctx.fillText(e,32,144,this.canvas.width-64)}drawBar(t,i,s,e){const l=112*t,o=l+160,n=l+208,c=l+214,h=l+252,r=l+192;this.ctx.fillStyle=this.bgColor,this.ctx.fillRect(128,o,544,112),this.ctx.fillStyle="black",this.ctx.fillRect(128,n,544,64),this.ctx.fillStyle=i[0];const x=5.44*s-3;this.ctx.fillRect(128,c,x,52),this.ctx.fillStyle=i[1];const a=403-5.44*(50-s),f=5.44*(100-s)-3;if(this.ctx.fillRect(a,c,f,52),this.setFontsize(32),this.ctx.fillStyle="#080808",s>20){this.ctx.textAlign="left";const t=s.toFixed(1)+"%";this.ctx.fillText(t,136,h)}if(s<80){this.ctx.textAlign="right";const t=(100-s).toFixed(1)+"%";this.ctx.fillText(t,664,h)}this.ctx.fillStyle=this.fgColor,this.ctx.textAlign="center",this.setFontsize(24),this.ctx.fillText(e,400,r)}drawImages(t,i){t.forEach(((t,s)=>{const e=192+112*i,l=32+640*s,o=new Image;o.src=t,o.addEventListener("load",(()=>this.ctx.drawImage(o,l,e,96,96)))}))}}