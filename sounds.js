const sounds = {
  throw: new Audio("https://actions.google.com/sounds/v1/foley/cloth_swipe.ogg"),
  catch: new Audio("https://actions.google.com/sounds/v1/sports/football_catch.ogg"),
  tackle: new Audio("https://actions.google.com/sounds/v1/impacts/body_hit.ogg"),
  score: new Audio("https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg")
};

function playSound(name){
  if(sounds[name]){
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}
