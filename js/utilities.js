var pagenumber=1;

function play() {
  var audio = document.getElementById("audio");
  audio.play();
  audio.muted=false;
  document.getElementById("audioon").style.display='block';
  document.getElementById("audiooff").style.display='none';
}

function stop() {
  var audio = document.getElementById("audio");
  audio.muted=true;
  document.getElementById("audiooff").style.display='block';
  document.getElementById("audioon").style.display='none';
}

function popup_content(hideOrshow, id) {
  if (hideOrshow == 'hide') document.getElementById(id).style.display = "none";
  else document.getElementById(id).removeAttribute('style');
}

function nextPage(){
  if (pagenumber==1){
    document.getElementById("prev").style.display="block";
  }
  pagenumber++;
  if(pagenumber==4){
    document.getElementById("next").style.display="none";
    document.getElementById("play").style.display="block";
  }
}

function prevPage(){
  if(pagenumber==4){
    document.getElementById("play").style.display="none";
    document.getElementById("next").style.display="block";
  }
  pagenumber--;
  if(pagenumber==1){
    document.getElementById("prev").style.display="none";
  }
}

function updateText(){
  if(pagenumber==1){
    document.getElementById('boxtitle').innerHTML ="The controls (1/4)";
    document.getElementById('boxtext').innerHTML ="Welcome to the Chocobo farm! You are a farmer tasked with the job of planting gysahl greens to feed the chocobos in your farm. However, there is a lot of competition in the field, and your enemies are ready to do anything in order to get in your way. Someone has been coming during the night placing traps in your field. If you trigger a trap, your Chocobos will escape and eat all of your gysahl greens. What a disaster! Let's now go over the controls of the game.";
    document.getElementById('mines_counter_pic').style.display='none';
  }
  else if(pagenumber==2){
    document.getElementById('boxtitle').innerHTML ="The controls (2/4) - Setting the mines";
    document.getElementById('boxtext').innerHTML ="The first step is placing the mines in your opponent's field. First, P2 will place the mines in P1's field, and then P1 will do the same in P2's field. Each player has five mines to place in the opponent's field. By moving the mouse around the screen, the hovered patch will glow yellow. Once you have chosen the patch where you want to dig your mine, you can click on the patch, which won't be selectable anymore. The counter in the top left of the screen will tell you how many mines you have left to place, and in which field the mines are being placed.";
    document.getElementById('game_flow_pic').style.display='none';
    document.getElementById('mines_counter_pic').style.display='block';
  }
  else if(pagenumber==3){
    document.getElementById('boxtitle').innerHTML ="The controls (3/4) - Planting the gysahl";
    document.getElementById('boxtext').innerHTML ="After all the mines have been placed, it's time to start planting! Starting from P1, the players have to take turns planting the gysahl greens in their field. The planting works the same way as the digging, so hover those patches and plant your gysahl! But be careful, if while digging you touch the mines your opponent set up, your stable's door will blow up and your chocobo will run away with all your harvest!";
    document.getElementById('game_flow_pic').style.display='block';
    document.getElementById('mines_counter_pic').style.display='none';
  }
  else if(pagenumber==4){
    document.getElementById('boxtitle').innerHTML ="The controls (4/4) - Winning";
    document.getElementById('boxtext').innerHTML ="If you want to win, the key is the placement of your mines... And of course a little bit of luck! The first one to touch a mine is the loser. Keep trying in order to become the best chocobo farmer and perfect your strategy!";
    document.getElementById('game_flow_pic').style.display='none';
  }
}

function updateTextvspc(){
  if(pagenumber==1){
    document.getElementById('boxtitle').innerHTML ="The controls (1/4)";
    document.getElementById('boxtext').innerHTML ="Welcome to the Chocobo farm! You are a farmer tasked with the job of planting gysahl greens to feed the chocobos in your farm. However, there is a lot of competition in the field, and your enemies are ready to do anything in order to get in your way. Someone has been coming during the night placing traps in your field. If you trigger a trap, your Chocobos will escape and eat all of your gysahl greens. What a disaster! Let's now go over the controls of the game.";
    document.getElementById('mines_counter_pic').style.display='none';
  }
  else if(pagenumber==2){
    document.getElementById('boxtitle').innerHTML ="The controls (2/4) - Setting the mines";
    document.getElementById('boxtext').innerHTML ="The first step is placing the mines in your opponent's field. The PC will randomly place the mines in your field at the start of the game, while you have to place them manually in his. Each player has five mines to place in the opponent's field. By moving the mouse around the screen, the hovered patch will glow yellow. Once you have chosen the patch where you want to dig your mine, you can click on the patch, which won't be selectable anymore. The counter in the top left of the screen will tell you how many mines you have left to place in the PC's field.";
    document.getElementById('game_flow_pic').style.display='none';
    document.getElementById('mines_counter_pic').style.display='block';
  }
  else if(pagenumber==3){
    document.getElementById('boxtitle').innerHTML ="The controls (3/4) - Planting the gysahl";
    document.getElementById('boxtext').innerHTML ="After all the mines have been placed, it's time to start planting! Starting from you, the players have to take turns planting the gysahl greens in their field. The planting works the same way as the digging, so hover those patches and plant your gysahl! But be careful, if while digging you touch the mines your opponent set up, your stable's door will blow up and your chocobo will run away with all your harvest!";
    document.getElementById('game_flow_pic').style.display='block';
    document.getElementById('mines_counter_pic').style.display='none';
  }
  else if(pagenumber==4){
    document.getElementById('boxtitle').innerHTML ="The controls (4/4) - Winning";
    document.getElementById('boxtext').innerHTML ="If you want to win, the key is the placement of your mines... And of course a little bit of luck! The first one to touch a mine is the loser. Keep trying in order to become the best chocobo farmer and perfect your strategy!";
    document.getElementById('game_flow_pic').style.display='none';
  }
}

function show(){
  document.getElementById('boxtitle').innerHTML="P2's turn";
  document.getElementById('boxtext').innerHTML="P2, it's your turn to set the mines in P1's field. You have five mines, and you can set them by clicking on the patch where you want to dig them. The currently selected patch will become yellow. To remember where you dug them, you decide to place rock mounds on top of them. The counter will tell you how many mines you have left. Be careful where you click, since you can't undo the positioning!";
  document.getElementById('place_mines_pic').style.display='block';
  document.getElementById('game_flow_pic').style.display='none';
  document.getElementById('mines_counter_pic').style.display='none';
  document.getElementById('prev').style.display='none';
  document.getElementById('next').style.display='none';
  document.getElementById('play').style.display='none';
  document.getElementById('cancel').style.display='none';
  document.getElementById('expl').style.display='none';
  document.getElementById('chest').style.display='block';
  document.getElementById('done').style.display='block';
  document.getElementById('popup_content_1').style.display="block";
  document.getElementById('popup_content_wrap').style.display='block';
}

function showvspc(){
  document.getElementById('boxtitle').innerHTML="Player's turn";
  document.getElementById('boxtext').innerHTML="Player, it's your turn to set the mines in PC's field. You have five mines, and you can set them by clicking on the patch where you want to dig them. The currently selected patch will become yellow. To remember where you dug them, you decide to place rock mounds on top of them. The counter will tell you how many mines you have left. Be careful where you click, since you can't undo the positioning!";
  document.getElementById('place_mines_pic').style.display='block';
  document.getElementById('game_flow_pic').style.display='none';
  document.getElementById('mines_counter_pic').style.display='none';
  document.getElementById('prev').style.display='none';
  document.getElementById('next').style.display='none';
  document.getElementById('play').style.display='none';
  document.getElementById('cancel').style.display='none';
  document.getElementById('expl').style.display='none';
  document.getElementById('chest').style.display='block';
  document.getElementById('done').style.display='block';
  document.getElementById('popup_content_1').style.display="block";
  document.getElementById('popup_content_wrap').style.display='block';
}