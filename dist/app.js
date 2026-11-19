import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
const mount=document.querySelector('#scene');
const zones=[
 {name:'Renewable energy',tag:'01 / GENERATE',x:-22,z:-16,c:'#819b55',copy:'Wind turbines and solar arrays bring clean energy into the system. This district is the starting point of the energy network.'},
 {name:'Power distribution',tag:'02 / CONNECT',x:-3,z:-18,c:'#ce8c62',copy:'Substations and transmission infrastructure connect energy generation to the industrial districts.'},
 {name:'Manufacturing',tag:'03 / MAKE',x:18,z:-13,c:'#6f9d9c',copy:'Production halls, cooling systems, and service buildings form the manufacturing district.'},
 {name:'Process & refining',tag:'04 / TRANSFORM',x:20,z:10,c:'#c0a54c',copy:'Towers, vessels, and interconnected pipes turn raw inputs into useful materials.'},
 {name:'Storage & logistics',tag:'05 / MOVE',x:-1,z:11,c:'#709d9e',copy:'Storage tanks and a rail corridor link production to distribution. Goods move across a shared infrastructure network.'},
 {name:'Port & shipping',tag:'06 / DISTRIBUTE',x:-22,z:17,c:'#62848f',copy:'The waterfront connects the industrial landscape to the wider world, with tank storage and a cargo vessel.'}
];
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){document.querySelector('#error').hidden=false;document.querySelector('#loading').hidden=true;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0xeeeae1);mount.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xeeeae1,100,230);
const camera=new THREE.PerspectiveCamera(36,1,.1,500);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=12;controls.maxDistance=160;controls.maxPolarAngle=Math.PI/2.2;controls.minPolarAngle=.18;controls.target.set(0,0,0);controls.autoRotateSpeed=.35;
scene.add(new THREE.HemisphereLight(0xfff9e7,0xa1ad9b,2.8));const sun=new THREE.DirectionalLight(0xfff4dd,4);sun.position.set(-30,60,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;sun.shadow.normalBias=.05;scene.add(sun);
const mats={};function mat(c){return mats[c]??=new THREE.MeshStandardMaterial({color:c,roughness:.86});}
function mesh(geo,c,x,y,z,parent=scene){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,c,x,y,z,p){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p);}
function cyl(r,h,c,x,y,z,p,r2=r){return mesh(new THREE.CylinderGeometry(r2,r,h,16),c,x,y,z,p);}
function beam(a,b,r,c,p=scene){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A);const m=mesh(new THREE.CylinderGeometry(r,r,v.length(),8),c,0,0,0,p);m.position.copy(A.add(B).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
const land=box(66,1,53,'#dfd4bd',0,-.7,0);box(66,.32,53,'#c8bda6',0,-1.35,0);box(17,.18,55,'#70999d',-42,-1.15,2);box(2,.2,50,'#c3beaa',-32.2,-.85,0);
const hits=[],rotors=[];let seed=15;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
function tree(x,z,s=1){cyl(.14*s,1.1*s,'#8e8063',x,.55*s,z);mesh(new THREE.IcosahedronGeometry(.9*s,1),'#a6b36f',x,1.7*s,z);mesh(new THREE.IcosahedronGeometry(.65*s,1),'#bdc58c',x+.45*s,1.6*s,z+.25*s);}
function road(x,z,w,d){box(w,.07,d,'#53615b',x,.02,z);if(w>d){for(let a=x-w/2+1;a<x+w/2;a+=2)box(.8,.02,.08,'#d6d5bc',a,.065,z);}else{for(let a=z-d/2+1;a<z+d/2;a+=2)box(.08,.02,.8,'#d6d5bc',x,.065,a);}}
road(0,-5,64,2.3);road(0,20,64,2.3);road(-13,0,2.3,50);road(9,0,2.3,50);road(30,0,2,50);
for(let i=0;i<70;i++){let x=-30+rand()*60,z=-24+rand()*48;if(Math.abs(z+5)<2||Math.abs(z-20)<2||Math.abs(x+13)<2||Math.abs(x-9)<2||Math.abs(x-30)<2)continue;if(rand()>.35)tree(x,z,.5+rand()*.45);}
function building(x,z,w=6,d=5,h=2.5){box(w,h,d,'#eeeade',x,h/2,z);box(w+.2,.23,d+.2,'#b4a693',x,h+.05,z);for(let i=0;i<Math.floor(w/.95);i++)box(.48,.55,.04,'#6d8b86',x-w/2+.65+i*.95,h*.6,z+d/2+.03);for(let i=0;i<3;i++){box(.7,.3,.9,'#d3cbbb',x-w*.28+i*w*.28,h+.3,z);}}
function tank(x,z,r=2,h=3){cyl(r,h,'#efeede',x,h/2,z);cyl(r+.08,.13,'#faf7e8',x,h+.04,z);cyl(r+.1,.12,'#b5bca6',x,.1,z);for(let i=0;i<3;i++)cyl(.07,.09,'#a0ac94',x+Math.cos(i*2.1)*r*.7,h+.16,z+Math.sin(i*2.1)*r*.7);}
function tower(x,z,h=8){tank(x,z,1.2,h);for(const dx of[-1.65,1.65])for(const dz of[-1.65,1.65])box(.2,h, .2,'#666c60',x+dx,h/2,z+dz);for(let y=1;y<h;y+=2){beam([x-1.65,y,z-1.65],[x+1.65,y+2,z-1.65],.08,'#707465');beam([x+1.65,y,z+1.65],[x-1.65,y+2,z+1.65],.08,'#707465');} }
function pipe(points,c='#43aaa2',r=.23){for(let i=1;i<points.length;i++)beam(points[i-1],points[i],r,c);for(const p of points)mesh(new THREE.SphereGeometry(r,8,6),c,...p);}
// Renewables: solar fields and individually animated wind turbines.
for(let x=-29;x<-16;x+=3.1)for(let z=-24;z<-12;z+=3.1){const panel=box(2.3,.12,1.65,'#7299ae',x,.8,z);panel.rotation.x=-.32;box(.12,.7,.12,'#9d9e85',x,.35,z);for(let j=-1;j<=1;j++)box(.025,.025,1.6,'#c8d8d1',x+j*.64,.96,z);}
function windmill(x,z){cyl(.19,7,'#eeeadd',x,3.5,z,scene,.1);const g=new THREE.Group();g.position.set(x,7,z);scene.add(g);cyl(.24,.65,'#e6e3d2',x,7,z);for(let i=0;i<3;i++){const pivot=new THREE.Group();pivot.rotation.z=i*Math.PI*2/3;g.add(pivot);const blade=box(.23,3,.12,'#faf7e9',0,1.6,0,pivot);blade.rotation.z=-.1;}rotors.push(g);}
windmill(-27,-9);windmill(-20,-9);windmill(-29,-21);
// Substation and transmission structures.
building(-3,-19,8,5,1.2);for(let x=-7;x<3;x+=2.1){box(1.2,1.4,1.8,'#8a9891',x,.7,-17);for(let j=0;j<3;j++)cyl(.11,1,'#b8986d',x-.35+j*.35,1.9,-17);}
for(let x=-10;x<=8;x+=9){for(let dx of[-1,1])beam([x+dx,0,-11],[x+dx*.3,7,-11],.09,'#9c9b86');beam([x-2,5.5,-11],[x+2,5.5,-11],.12,'#bb8c6c');beam([x-1,0,-11],[x+.6,4,-11],.08,'#b8b6a0');}
for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=40;i++){const x=-10+i*.45;pts.push(new THREE.Vector3(x,5.6-Math.abs(Math.sin((x+10)/9*Math.PI))*.8,-11+(j-1)*.5));}scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x777d70})));}
// Manufacturing district.
building(20,-16,12,7,3);building(17,-9,6,3,1.8);for(let x=16;x<26;x+=2.4){box(1.6,.6,1.8,'#a3aaa0',x,3.5,-16);cyl(.6,.08,'#6c8078',x,3.85,-16);}for(let x of[25,27]){cyl(.5,8,'#dad4bf',x,4,-20);cyl(.52,.65,'#b57c66',x,6,-20);cyl(.52,.65,'#b57c66',x,7.3,-20);}
// Process district.
building(21,10,12,7,2.2);tower(17,7,10);tower(24,9,7.5);for(let z=8;z<16;z+=2.2){cyl(.65,5,'#d3cbb9',27,2.5,z);cyl(.68,.15,'#f2eddb',27,5,z);}for(let x=16;x<26;x+=2.2)box(1.3,.4,1.4,'#9ca496',x,2.6,12);
// Tank farm and rail.
for(let x=-6;x<=3;x+=4.3)for(let z=7;z<=15;z+=5)tank(x,z,1.8,2.6);
box(58,.1,1.65,'#a89e85',0,.08,1);for(let x=-28;x<29;x+=.7)box(.18,.12,1.65,'#857e6b',x,.15,1);for(let z of[.45,1.55])box(58,.08,.065,'#d0cebc',0,.24,z);
const train=new THREE.Group();scene.add(train);box(2.4,1.3,1,'#b66d50',0,.95,0,train);box(.8,.65,1,'#d5c3a0',.65,1.85,0,train);for(let i=1;i<6;i++){const body=cyl(.56,2.7,'#f0eedf',-i*3.2,1.05,0,train);body.rotation.z=Math.PI/2;box(2.6,.22,1.1,'#707a6b',-i*3.2,.48,0,train);}train.position.set(7,0,1);
// Waterfront.
box(12,.35,15,'#b8b8a3',-27,-.15,16);for(let x of[-29,-24])for(let z of[11,17])tank(x,z,2,3);box(4.7,.5,15,'#b8b8a3',-34,-.1,18);const ship=new THREE.Group();scene.add(ship);box(4,1.1,11,'#5b6f6b',-41,-.1,18,ship);box(3.5,.55,9,'#a6765b',-41,.7,18,ship);box(2.9,2.2,2.8,'#eee9d6',-41,1.7,21,ship);box(.55,2,.55,'#a96a50',-41,3.4,21,ship);for(let i=0;i<3;i++)box(2.8,.8,1.5,['#9f9270','#779996','#b7916a'][i],-41,1.3,15+i*1.8,ship);
// Above-ground utility routes.
pipe([[-3,1.8,-17],[-3,1.8,-8],[5,1.8,-8],[5,3.2,-2],[14,3.2,-2],[14,1.8,7],[17,1.8,7]]);pipe([[20,2,-12],[28,2,-12],[28,2,17],[4,2,17],[4,2,10]],'#45a69d');pipe([[-27,1.5,17],[-17,1.5,17],[-17,1.5,4],[12,1.5,4],[12,2.8,12],[24,2.8,12]],'#cbb449',.17);
for(let z=-22;z<23;z+=3){tree(-11,z,.65);tree(11,z,.65);}for(let x=-28;x<30;x+=3.8)tree(x,-3,.65);
// Landmark buttons follow their true 3D positions.
const labels=document.querySelector('#labels'),nav=document.querySelector('#sections');zones.forEach((zone,i)=>{const button=document.createElement('button');button.className='pin';button.style.setProperty('--c',zone.c);button.innerHTML=`${zone.name} <span>↗</span>`;button.onclick=()=>select(i);labels.appendChild(button);zone.el=button;const item=document.createElement('button');item.className='zone';item.style.setProperty('--c',zone.c);item.innerHTML=`<small>0${i+1}</small><span class="dot"></span>${zone.name}<span class="arrow">↗</span>`;item.onclick=()=>select(i);nav.appendChild(item);zone.nav=item;const target=mesh(new THREE.BoxGeometry(17,14,15),'#ffffff',zone.x,5,zone.z);target.visible=false;target.userData.zone=i;hits.push(target);});
let selected=-1,tween=null;const home={position:new THREE.Vector3(83,74,93),target:new THREE.Vector3(-8,0,0)};
function fly(position,target){tween={from:camera.position.clone(),to:position,fromTarget:controls.target.clone(),toTarget:target,start:performance.now()};controls.autoRotate=false;document.querySelector('#rotate').classList.remove('active');}
function reset(){selected=-1;document.querySelector('#detail').hidden=true;zones.forEach(z=>z.nav.classList.remove('active'));fly(home.position.clone(),home.target.clone());}
function select(i){selected=i;const z=zones[i];zones.forEach((v,j)=>v.nav.classList.toggle('active',i===j));document.querySelector('#detail').hidden=false;document.querySelector('#detail-kicker').textContent=z.tag;document.querySelector('#detail-title').textContent=z.name;document.querySelector('#detail-copy').textContent=z.copy;fly(new THREE.Vector3(z.x+24,25,z.z+29),new THREE.Vector3(z.x,1,z.z));}
document.querySelector('#reset').onclick=reset;document.querySelector('#close').onclick=reset;document.querySelector('#back').onclick=reset;
function zoom(factor){const v=camera.position.clone().sub(controls.target);v.multiplyScalar(factor);v.clampLength(controls.minDistance,controls.maxDistance);fly(controls.target.clone().add(v),controls.target.clone());}
document.querySelector('#plus').onclick=()=>zoom(.8);document.querySelector('#minus').onclick=()=>zoom(1.25);document.querySelector('#rotate').onclick=e=>{tween=null;controls.autoRotate=!controls.autoRotate;e.currentTarget.classList.toggle('active',controls.autoRotate);};
controls.addEventListener('start',()=>{tween=null;});window.addEventListener('keydown',e=>{if(e.key==='Escape')reset();if(e.key==='+'||e.key==='=')zoom(.8);if(e.key==='-')zoom(1.25);});
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down={x:0,y:0};renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(hits)[0];if(hit)select(hit.object.userData.zone);});
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();camera.position.copy(home.position);controls.target.copy(home.target);controls.update();document.querySelector('#loading').hidden=true;
const projected=new THREE.Vector3();let last=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(tween){const t=Math.min((now-tween.start)/1300,1),k=t*t*(3-2*t);camera.position.lerpVectors(tween.from,tween.to,k);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,k);if(t===1)tween=null;}rotors.forEach(r=>r.rotation.z-=dt*.55);train.position.x+=dt*.65;if(train.position.x>42)train.position.x=-27;controls.update();zones.forEach((z,i)=>{projected.set(z.x,8,z.z).project(camera);const x=(projected.x*.5+.5)*innerWidth,y=(-projected.y*.5+.5)*innerHeight;z.el.style.left=x+'px';z.el.style.top=y+'px';z.el.style.display=(selected>=0&&selected!==i)||projected.z>1||x<320&&innerWidth>800?'none':'';});renderer.render(scene,camera);}requestAnimationFrame(animate);
window.atlas={select,reset,zones,scene,camera,controls};
