/* Form a centered square, unfold the menu, then carry it left. */
window.atlasReveal=async function(){
 if(document.fonts?.ready)await document.fonts.ready;
 const surface=document.querySelector('#loading'),host=document.querySelector('.intro'),toggle=document.querySelector('#locations-toggle'),compact=matchMedia('(max-width:900px)').matches,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,duration=reduced?0:850;
 if(compact){host.dataset.open='true';toggle.setAttribute('aria-expanded','true');toggle.querySelector('span').textContent='Close locations';toggle.style.visibility='hidden';}
 host.style.transition='none';host.classList.add('panel-visible');
 const target=host.getBoundingClientRect(),dx=(innerWidth-target.width)/2-target.left,dy=(innerHeight-target.height)/2-target.top;
 const squareHeight=Math.min(target.width,target.height),fold=target.height-squareHeight,offset=fold/2;host.style.translate=dx+'px '+(dy+offset)+'px';host.style.clipPath='inset(0px 0px '+fold+'px 0px round 18px)';
 const center=host.getBoundingClientRect(),orb=surface.querySelector('.loader-orb'),orbStart=orb.getBoundingClientRect(),placeholder=host.querySelector('.panel-orb'),orbEnd=placeholder.getBoundingClientRect();
 function moveOrb(parent,before=null){const flow=orb.querySelector('.loader-orb-flow'),loop=flow.getAnimations()[0],time=loop?.currentTime;if(parent.moveBefore)parent.moveBefore(orb,before);else{parent.insertBefore(orb,before);const resumed=flow.getAnimations()[0];if(resumed&&time!==null&&time!==undefined)resumed.currentTime=time;}}
 const contentNodes=[...host.children];for(const node of contentNodes)node.style.opacity='0';
 const state=window.atlasRevealState={phase:'square',compact,originalSurface:surface,originalOrb:orb,typing:false};
 host.classList.add('morph-host');document.body.classList.add('world-revealing');
 const tint=document.createElement('div');Object.assign(tint.style,{position:'absolute',inset:'0',background:getComputedStyle(surface).background,pointerEvents:'none',zIndex:'-1'});surface.prepend(tint);surface.style.background='none';surface.style.backgroundColor='#f6f9ff';
 orb.classList.add('orb-from-loader');moveOrb(document.querySelector('#app'));Object.assign(orb.style,{position:'absolute',inset:'auto',left:orbStart.left+'px',top:orbStart.top+'px',width:orbStart.width+'px',height:orbStart.height+'px',zIndex:'30',pointerEvents:'none'});placeholder.style.visibility='hidden';
 const options={duration,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'};
 const orbMotion=orb.animate([{left:orbStart.left+'px',top:orbStart.top+'px',width:orbStart.width+'px',height:orbStart.height+'px',borderRadius:'50%'},{left:orbEnd.left+'px',top:orbEnd.top+'px',width:orbEnd.width+'px',height:orbEnd.height+'px',borderRadius:'50%'}],options);
 const fade=surface.querySelector('.loader-center').animate([{opacity:1},{opacity:0}],{duration:reduced?0:180,fill:'forwards'});tint.animate([{opacity:1},{opacity:0}],{duration:duration*.8,fill:'forwards'});
 document.body.classList.remove('world-loading');document.body.classList.add('world-ready');Object.assign(surface.style,{inset:'auto',left:'0',top:'0',width:innerWidth+'px',height:innerHeight+'px',border:'1px solid transparent',pointerEvents:'none'});
 const motion=surface.animate([{left:'0px',top:'0px',width:innerWidth+'px',height:innerHeight+'px',borderRadius:'0px',backgroundColor:'#f6f9ff',backdropFilter:'blur(0px)',borderColor:'transparent',boxShadow:'0 0 0 #487f9800'},{left:center.left+'px',top:center.top+'px',width:center.width+'px',height:squareHeight+'px',borderRadius:'18px',backgroundColor:'rgba(242,251,255,.72)',backdropFilter:'blur(6px)',borderColor:'rgba(255,255,255,.82)',boxShadow:'0 12px 38px #487f9820'}],options);
 await Promise.all([motion.finished,orbMotion.finished,fade.finished]);
 orb.className='panel-orb orb-from-loader continuous-orb';moveOrb(placeholder.parentElement,placeholder);placeholder.remove();orb.removeAttribute('style');orbMotion.cancel();
 surface.replaceChildren();surface.id='city-menu-glass';surface.removeAttribute('aria-label');surface.setAttribute('aria-hidden','true');surface.className='loading-glass-surface';host.prepend(surface);surface.removeAttribute('style');motion.cancel();
 state.phase='opening';for(const node of contentNodes)node.style.opacity='';
 const unfold=host.animate([{translate:dx+'px '+(dy+offset)+'px',clipPath:'inset(0px 0px '+fold+'px 0px round 18px)'},{translate:dx+'px '+dy+'px',clipPath:'inset(0px 0px 0px 0px round 18px)'}],{duration:reduced?0:1000,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});await unfold.finished;host.style.translate=dx+'px '+dy+'px';host.style.removeProperty('clip-path');unfold.cancel();
 state.phase='moving';
 const slide=host.animate([{translate:dx+'px '+dy+'px'},{translate:'0px 0px'}],{duration:reduced?0:1000,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});await slide.finished;host.style.translate='0px 0px';slide.cancel();
 toggle.style.removeProperty('visibility');document.body.classList.remove('world-revealing');state.phase='complete';
};
