const c=document.getElementById("c");
const ctx=c.getContext("2d");

c.width=window.innerWidth;
c.height=window.innerHeight*0.7;

// TEAM COLORS
const teamColors = {
  offense:"#FFD700",
  defense:"#FFFFFF"
};

// PLAYER MODEL
function drawPlayer(p,color){
  // body
  ctx.fillStyle=color;
  ctx.fillRect(p.x,p.y,14,20);

  // helmet
  ctx.fillStyle="#222";
  ctx.fillRect(p.x+2,p.y-6,10,6);

  // legs (animation)
  let legOffset = Math.sin(Date.now()/100)*3;
  ctx.fillRect(p.x,p.y+20+legOffset,4,6);
  ctx.fillRect(p.x+10,p.y+20-legOffset,4,6);
}

// ENTITIES
let qb,receivers,defenders,ball;

function reset(){
  qb={x:80,y:150,speed:1.5};

  receivers=[
    {x:120,y:100,dx:2,dy:-0.5},
    {x:120,y:200,dx:2,dy:0.5}
  ];

  defenders=[
    {x:400,y:120},
    {x:420,y:200}
  ];

  ball=null;
}
reset();

// TOUCH
let start=null;

document.addEventListener("touchstart",e=>{
  let t=e.touches[0];
  start={x:t.clientX,y:t.clientY};
});

document.addEventListener("touchend",e=>{
  if(!start) return;

  let t=e.changedTouches[0];

  ball={
    x:qb.x,
    y:qb.y,
    vx:(t.clientX-start.x)*0.05,
    vy:(t.clientY-start.y)*0.05,
    active:true
  };

  playSound("throw");
});

// UPDATE
function update(){

  qb.x+=qb.speed;

  receivers.forEach(r=>{
    r.x+=r.dx;
    r.y+=r.dy;
  });

  defenders.forEach(d=>{
    let target = ball?.active ? ball : qb;
    d.x += (target.x-d.x)*0.05;
    d.y += (target.y-d.y)*0.05;
  });

  if(ball?.active){
    ball.x+=ball.vx;
    ball.y+=ball.vy;

    receivers.forEach(r=>{
      if(Math.abs(ball.x-r.x)<15){
        qb.x=r.x;
        qb.y=r.y;
        ball.active=false;

        playSound("catch");
        showMessage("Catch!");
      }
    });
  }

  defenders.forEach(d=>{
    if(Math.abs(d.x-qb.x)<15){
      playSound("tackle");
      showMessage("Tackled");
      reset();
    }
  });

  if(qb.x > c.width-60){
    playSound("score");
    showMessage("TOUCHDOWN!");
    reset();
  }
}

// DRAW
function draw(){

  // field gradient
  let g=ctx.createLinearGradient(0,0,0,c.height);
  g.addColorStop(0,"#0a5");
  g.addColorStop(1,"#063");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,c.width,c.height);

  // yard lines
  ctx.strokeStyle="white";
  for(let i=0;i<c.width;i+=60){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,c.height);
    ctx.stroke();
  }

  // players
  drawPlayer(qb,teamColors.offense);

  receivers.forEach(r=>drawPlayer(r,teamColors.offense));
  defenders.forEach(d=>drawPlayer(d,teamColors.defense));

  // ball
  if(ball){
    ctx.fillStyle="brown";
    ctx.fillRect(ball.x,ball.y,6,6);
  }

  // aim line
  if(start){
    ctx.strokeStyle="red";
    ctx.beginPath();
    ctx.moveTo(qb.x,qb.y);
    ctx.lineTo(start.x,start.y);
    ctx.stroke();
  }
}

// LOOP
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
