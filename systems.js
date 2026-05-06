function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function showMessage(text){
  let el=document.getElementById("hudMessage");
  el.innerText=text;
  setTimeout(()=>el.innerText="",1500);
}
