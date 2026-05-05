function P(name){
  return {
    name,
    ovr:Math.floor(Math.random()*30)+65,
    salary:0
  };
}

let sandbox=false;

let team={
  cap:1000,
  roster:[
    P("QB1"),
    P("WR1"),
    P("WR2"),
    P("RB1"),
    P("TE1")
  ]
};

team.roster.forEach(p=>p.salary=p.ovr*10);

let freeAgents=[];
for(let i=0;i<12;i++) freeAgents.push(P("FA "+(i+1)));
freeAgents.forEach(p=>p.salary=p.ovr*10);

// NAV helper
function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if(id==="roster") renderRoster();
  if(id==="trade") renderTrade();
  if(id==="fa") renderFA();
}

function toggleSandbox(){
  sandbox=!sandbox;
  alert("Sandbox: "+sandbox);
}

// ================= ROSTER =================
function renderRoster(){
  let div=document.getElementById("rosterList");
  div.innerHTML="<h2>Roster</h2>";

  team.roster.forEach((p,i)=>{
    div.innerHTML+=`
      <div class="item">
        ${p.name} OVR ${p.ovr}
        <button onclick="cut(${i})">Cut</button>
      </div>`;
  });
}

function cut(i){
  team.roster.splice(i,1);
  renderRoster();
}

// ================= FREE AGENT =================
function renderFA(){
  let div=document.getElementById("faList");
  div.innerHTML="<h2>Free Agency</h2>";

  freeAgents.forEach((p,i)=>{
    div.innerHTML+=`
      <div class="item">
        ${p.name} OVR ${p.ovr}
        <button onclick="sign(${i})">Sign</button>
      </div>`;
  });
}

function sign(i){
  let p=freeAgents[i];

  if(!sandbox && team.cap < p.salary){
    alert("No cap space");
    return;
  }

  team.cap -= p.salary;
  team.roster.push(p);
  freeAgents.splice(i,1);

  renderFA();
}

// ================= TRADE =================
function renderTrade(){
  let div=document.getElementById("tradeList");
  div.innerHTML="<h2>Trade Center</h2>";

  let cpu=P("CPU QB");

  div.innerHTML+=`
    <div class="item">
      ${cpu.name} OVR ${cpu.ovr}
      <button onclick="trade()">Offer Trade</button>
    </div>`;
}

function trade(){
  let my=team.roster[0];
  let cpu=P("CPU QB");

  if(cpu.ovr > my.ovr){
    alert("Rejected");
  } else {
    team.roster[0]=cpu;
    alert("Trade Accepted");
  }
}
