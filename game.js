const c=document.getElementById("c");
const ctx=c.getContext("2d");

c.width=window.innerWidth;
c.height=window.innerHeight*0.7;

let qb={x:80,y:150};
let def={x:400,y:150};
let ball=null;

// swipe pass
let start=null;

document.addEventListener("touchstart",e=>{
  let t=e.touches[0];
  start={x:t.clientX,y:t.clientY};
});

document.addEventListener("touchend",e=>{
  if(!start) return;

  let t=e.changedTouches[0];
  let dx=t.clientX-start.x;
  let dy=t.clientY-start.y;

  ball={
    x:qb.x,
    y:qb.y,
    vx:dx*0.05,
    vy:dy*0.05,
    active:true
  };
});

function update(){
  qb.x += 2;

  def.x += (qb.x - def.x)*0.04;
  def.y += (qb.y - def.y)*0.04;

  if(ball?.active){
    ball.x += ball.vx;
    ball.y += ball.vy;

    if(Math.abs(ball.x-qb.x)<15){
      qb.x += 40;
      ball.active=false;
    }
  }

  if(Math.abs(def.x-qb.x)<15){
    reset();
  }

  if(qb.x > c.width-60){
    alert("TOUCHDOWN");
    reset();
  }
}

function draw(){
  ctx.clearRect(0,0,c.width,c.height);

  ctx.fillStyle="#0a5";
  ctx.fillRect(0,0,c.width,c.height);

  ctx.strokeStyle="white";
  for(let i=0;i<c.width;i+=60){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,c.height);
    ctx.stroke();
  }

  ctx.fillStyle="yellow";
  ctx.fillRect(qb.x,qb.y,15,15);

  ctx.fillStyle="white";
  ctx.fillRect(def.x,def.y,15,15);

  if(ball){
    ctx.fillStyle="brown";
    ctx.fillRect(ball.x,ball.y,6,6);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

function reset(){
  qb={x:80,y:150};
  def={x:400,y:150};
  ball=null;
}
