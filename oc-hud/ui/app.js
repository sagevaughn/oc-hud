const circumference = 2 * Math.PI * 45;
const hud = document.getElementById('hud');

function setCircle(id, percent) {
  const c = document.getElementById(id);
  const offset = circumference - (percent / 100) * circumference;
  c.style.strokeDasharray = circumference;
  c.style.strokeDashoffset = offset;
}

/* Drag + Save Position */
let dragging=false, ox=0, oy=0;

hud.onmousedown = e => { dragging=true; ox=e.offsetX; oy=e.offsetY; };
document.onmousemove = e => {
  if (!dragging) return;
  hud.style.left=(e.pageX-ox)+'px';
  hud.style.top=(e.pageY-oy)+'px';
  hud.style.bottom='auto';

  fetch(`https://${GetParentResourceName()}/savePos`, {
    method:'POST',
    body: JSON.stringify({x:hud.style.left,y:hud.style.top})
  });
};
document.onmouseup = ()=> dragging=false;

/* Theme Presets */
document.getElementById('theme').onchange = function() {
  const t = this.value;
  if (t==="red") {
    document.documentElement.style.setProperty('--health','#ff0000');
    document.documentElement.style.setProperty('--voice','#ff66ff');
  } else if (t==="blue") {
    document.documentElement.style.setProperty('--health','#00ccff');
  } else if (t==="purple") {
    document.documentElement.style.setProperty('--health','#bb66ff');
  }
};

/* HUD Updates */
window.addEventListener('message', (e)=>{
  const d=e.data;
  if(d.type!=='update') return;

  setCircle('health',d.health);
  setCircle('armor',d.armor);
  setCircle('hunger',d.hunger);
  setCircle('thirst',d.thirst);
  setCircle('voice',d.voice);

  document.getElementById('compass').textContent=d.heading;
  document.getElementById('street').textContent=d.street;

  if(d.inVehicle){
    vehiclehud.style.display='block';
    speed.textContent=d.speed;
    fuel.textContent=d.fuel;
  } else vehiclehud.style.display='none';
});
