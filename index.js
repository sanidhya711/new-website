
new fullpage('#fullpage', {
//options here
autoScrolling:true,
scrollHorizontally: true,
verticalCentered:false,
autoScrolling:true,
fadingEffect:true,
navigation:true,
controlArrows:false,
slidesNavigation:true,
anchors: ['firstPage', 'secondPage', 'thirdPage','fourthPage','fifthPage'],
});

//methods
fullpage_api.setAllowScrolling(true);


function expand(){
$(".icon-holder").animate({left:"70px",opacity:"100%"});
}

function collapse(){
$(".icon-holder").animate({left:"-300px",opacity:"0%"});
}
var hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function() {
hamburger.classList.toggle("is-active");
if($(".hamburger").hasClass("is-active")){
expand();
}else{
collapse();
}

});

var play_pause = document.querySelector(".pause");
var video = document.querySelector("video");
var audio = document.querySelector("audio");
var play_pause_button = document.querySelector(".play-pause-button");
var playing = true;
play_pause.addEventListener("click",function(){
if(playing){
  video.pause();
  audio.pause();
  playing = false;
  play_pause_button.innerHTML="Play"
}else{
  video.play();
  audio.play();
  playing = true;
  play_pause_button.innerHTML="Pause"
}
});

var reqURL = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=");
function loadVideo(iframe) {
$.getJSON(reqURL + iframe.getAttribute('cid'),
function(data) {
var videoNumber = (iframe.getAttribute('vnum') ? Number(iframe.getAttribute('vnum')) : 0);
var link = data.items[videoNumber].link;
id = link.substr(link.indexOf("=") + 1);
iframe.setAttribute("src", "https://youtube.com/embed/" + id + "?controls=1&autoplay=0");
}
);
}
var iframes = document.getElementsByClassName('latestVideoEmbed');
for (var i = 0, len = iframes.length; i < len; i++) {
loadVideo(iframes[i]);
}

//slide show for my wallpapers
setInterval(() => {
fullpage_api.moveSlideRight();
},6000);


var windowWidth = window.innerWidth;
var spotifyLink = '<i class="fa fa-external-link fa-2x" aria-hidden="true"></i>';

if(windowWidth<920){
  document.getElementById("spotifyLink").innerHTML=spotifyLink;
}

if(windowWidth<900){
  var weeb = document.querySelectorAll(".weeb");
  for (var counter = 0; counter < weeb.length; counter++) {
    weeb[counter].style.color = "#ffffff";
  }
  document.getElementById("wallpaper1").src="mobile1.jpg";
  document.getElementById("wallpaper2").src="mobile2.jpg";
  document.getElementById("wallpaper3").src="mobile3.jpg";
}

window.addEventListener("resize",function(){
  var windowWidth = window.innerWidth;
if(windowWidth<900){
  var weeb = document.querySelectorAll(".weeb");
  for (var counter = 0; counter < weeb.length; counter++) {
    weeb[counter].style.color = "#ffffff";
  }
  document.getElementById("wallpaper1").src="mobile1.jpg";
  document.getElementById("wallpaper2").src="mobile2.jpg";
  document.getElementById("wallpaper3").src="mobile3.jpg";
}else{
  var weeb = document.querySelectorAll(".weeb");
  for (var counter = 0; counter < weeb.length; counter++) {
    weeb[counter].style.color = "#221f1f";
  }
  document.getElementById("wallpaper1").src="desktop1.png";
  document.getElementById("wallpaper2").src="desktop2.jpg";
  document.getElementById("wallpaper3").src="desktop3.png";
}

if(windowWidth<920){
  document.getElementById("spotifyLink").innerHTML=spotifyLink;
}else{
  document.getElementById("spotifyLink").innerHTML='<div class="btn btn-lg btn-outline-light">checkout my playlist on spotify</div>';
}

});

function showTooltip(){
  document.getElementById("tooltip").style.opacity="1";
}
function hideTooltip(){
  document.getElementById("tooltip").style.opacity="0";
}


