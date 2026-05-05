// ================= NAV =================
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');

  if(id==="rosterScreen") renderRoster();
  if(id==="tradeScreen") renderTrade();
  if(id==="faScreen") renderFA();
}

// ================= STADIUM =================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

// ================= TEAM =================
function P(name){
  return {
    name,
    ovr:Math.floor(Math.random()*30)+65,
    salary:0
  };
}

let team = {
  cap:1000,
  roster:[P("QB"),P("WR1"),P("WR2")]
};

team.roster.forEach(p=>p.salary=p.ovr*10);

let freeAgents=[P("FA1"),P("FA2"),P("FA3")];
freeAgents.forEach(p=>p.salary=p.ovr*10);

let sandbox=false;

// ================= GAME =================
let qb={x:80,y:150};
let wr={x:120,y:100};
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

// ================= UPDATE =================
function update(){

  // QB movement
  qb.x += 2;

  // WR route
  wr.x += 1.5;

  // DEF AI (smart cut-off)
  let target = ball?.active ? ball : qb;

  def.x += (target.x - def.x)*0.05;
  def.y += (target.y - def.y)*0.05;

  // ball physics
  if(ball?.active){
    ball.x += ball.vx;
    ball.y += ball.vy;

    if(Math.abs(ball.x-wr.x)<15){
      qb.x=wr.x;
      qb.y=wr.y;
      ball.active=false;
    }
  }

  if(Math.abs(def.x-qb.x)<15){
    resetPlay();
  }

  if(qb.x>canvas.width-60){
    alert("TOUCHDOWN!");
    resetPlay();
  }
}

// ================= DRAW =================
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // field
  ctx.fillStyle="#0a5";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // yard lines
  ctx.strokeStyle="white";
  for(let i=0;i<canvas.width;i+=60){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,canvas.height);
    ctx.stroke();
  }

  // players
  ctx.fillStyle="yellow";
  ctx.fillRect(qb.x,qb.y,15,15);

  ctx.fillStyle="lime";
  ctx.fillRect(wr.x,wr.y,12,12);

  ctx.fillStyle="white";
  ctx.fillRect(def.x,def.y,14,14);

  // ball
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

// ================= RESET =================
function resetPlay(){
  qb={x:80,y:150};
  wr={x:120,y:100};
  def={x:400,y:150};
  ball=null;
}

// ================= ROSTER =================
function renderRoster(){
  let div=document.getElementById("rosterScreen");
  div.innerHTML="<h2>Roster</h2>";

  team.roster.forEach(p=>{
    div.innerHTML+=`
      <div>
        ${p.name} OVR ${p.ovr} $${p.salary}
      </div>`;
  });
}

// ================= FREE AGENCY =================
function renderFA(){
  let div=document.getElementById("faScreen");
  div.innerHTML="<h2>Free Agency</h2>";

  freeAgents.forEach((p,i)=>{
    div.innerHTML+=`
      <div>
        ${p.name} OVR ${p.ovr} $${p.salary}
        <button onclick="sign(${i})">Sign</button>
      </div>`;
  });
}

function sign(i){
  let p=freeAgents[i];

  if(!sandbox && team.cap < p.salary){
    alert("No cap!");
    return;
  }

  team.cap -= p.salary;
  team.roster.push(p);
  freeAgents.splice(i,1);

  renderFA();
}

// ================= TRADE =================
function renderTrade(){
  let div=document.getElementById("tradeScreen");
  div.innerHTML="<h2>Trade Center</h2>";

  let cpu=P("CPU Star QB");

  div.innerHTML+=`
    <div>
      ${cpu.name} OVR ${cpu.ovr}
      <button onclick="trade()">Offer Trade</button>
    </div>`;
}

function trade(){
  let my=team.roster[0];
  let cpu=P("CPU QB");

  if(cpu.ovr>my.ovr){
    alert("Rejected");
  } else {
    team.roster[0]=cpu;
    alert("Trade Accepted");
  }
}

// ================= SETTINGS =================
function toggleSandbox(){
  sandbox=!sandbox;
  alert("Sandbox: "+sandbox);
}
