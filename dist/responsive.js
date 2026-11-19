(()=>{
const sidebar=document.querySelector('.intro'),toggle=document.querySelector('#locations-toggle'),compact=matchMedia('(max-width:900px)');
function setOpen(open,restoreFocus=false){sidebar.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('span').textContent=open?'Close locations':'Explore locations';if(!open&&restoreFocus)toggle.focus();}
toggle.addEventListener('click',()=>setOpen(sidebar.dataset.open!=='true'));
sidebar.addEventListener('click',event=>{if(compact.matches&&event.target.closest('.zone,#reset,#day-night,#fullscreen'))setOpen(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&compact.matches&&sidebar.dataset.open==='true'){event.preventDefault();event.stopPropagation();setOpen(false,true);}},true);
document.querySelector('#scene').addEventListener('pointerdown',()=>{if(compact.matches)setOpen(false);});
document.querySelector('#labels').addEventListener('click',event=>{if(compact.matches&&event.target.closest('.pin'))setOpen(false);});
compact.addEventListener('change',()=>setOpen(false));setOpen(false);
})();
