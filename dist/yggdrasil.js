!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=18)}([function(e,t,n){"use strict";function o(){if(!s())return;let e,t=document.querySelector("canvas.a-canvas"),n=t.requestFullscreen||t.webkitRequestFullscreen||t.mozRequestFullScreen||t.msRequestFullscreen;n&&(e=n.apply(t)),e&&e.then||(e=Promise.resolve()),e.then(i,i)}function i(){screen.orientation&&screen.orientation.lock&&screen.orientation.lock("landscape").then(e=>{console.log("screen orientation locked:",e)}).catch(e=>{console.warn("screen orientation didn't lock:",e)})}function r(){return!(AFRAME.utils.device.isMobile()||AFRAME.utils.device.isMobileVR())}function s(){return AFRAME.utils.device.isMobile()&&!AFRAME.scenes[0].is("vr-mode")}function a(e,t,n){let o=e/180*Math.PI,i=n*Math.sin(o),r=n*Math.cos(o),s=t/180*Math.PI;return{x:r*Math.cos(s),y:i,z:-r*Math.sin(s)}}n.d(t,"b",function(){return o}),n.d(t,"c",function(){return r}),n.d(t,"d",function(){return s}),n.d(t,"a",function(){return a}),n.d(t,"e",function(){return d});var l=null;function d(e,t){l=new Howl({src:e,autoplay:!0,loop:!0,volume:t||1,html5:!1,onplayerror:function(){l.once("unlock",function(){l.play()})}})}document.addEventListener("visibilitychange",()=>{l&&(document.hidden?l.pause():l.play())},!1)},function(e,t,n){"use strict";n(2);var o=n(0);AFRAME.registerState({initialState:{armatureEl:null,gliderEl:null,cameraEl:null,time:0,difficulty:.6,gliderPosition:{x:-30,y:15,z:30},gliderPositionStart:{x:-30,y:15,z:30},gliderRotationX:0,gliderRotationY:-45,gliderRotationZ:0,gliderRotationYStart:-45,isFlying:!1,gliderSpeed:5,numYellowStars:Math.POSITIVE_INFINITY,stars:0,questComplete:!1,inventory:{},hudVisible:!0,hudText:"",controlsReminderDisplayed:!1,debug:!1},handlers:{setState:function(e,t){for(let n in t)"target"!==n&&(console.log("setting",n,t[n]),e[n]=t[n])},setArmatureEl:function(e,t){this.powerup=new Howl({src:["../assets/411460__inspectorj__power-up-bright-a.mp3"]}),console.log("hasNativeWebVRImplementation:",window.hasNativeWebVRImplementation),console.log("isMobile:",AFRAME.utils.device.isMobile()),console.log("isMobileVR:",AFRAME.utils.device.isMobileVR()),e.armatureEl=t,e.gliderEl=t.querySelector("#glider"),e.cameraEl=t.querySelector("[camera]");let n=AFRAME.scenes[0].querySelector("a-dust");n&&requestIdleCallback(()=>{n.components.dust.setCamera(e.armatureEl)});let i=e.armatureEl.querySelector("#body"),r=e.gliderEl.querySelector("#wing"),s=t.querySelector("#hud");this.adjustForMagicWindow(r),AFRAME.scenes[0].is("vr-mode")&&AFRAME.utils.device.checkHeadsetConnected()?(this.adjustHudForVR(s),e.difficulty=.75):(this.adjustHudForFlat(s),Object(o.d)()?e.difficulty=.6:e.difficulty=.5),AFRAME.scenes[0].addEventListener("enter-vr",t=>{AFRAME.utils.device.checkHeadsetConnected()&&(i.object3D.position.y=-1.6,this.adjustHudForVR(s),this.adjustForMagicWindow(r),e.difficulty=.75)}),AFRAME.scenes[0].addEventListener("exit-vr",t=>{this.adjustHudForFlat(s),this.adjustForMagicWindow(r),Object(o.d)()?e.difficulty=.6:e.difficulty=.5}),Object(o.c)()&&!AFRAME.utils.device.checkHeadsetConnected()&&(console.log("desktop w/o headset; disabling look-controls-z so keyboard controls can function"),e.cameraEl.setAttribute("look-controls-z","enabled","false")),e.gliderEl.addEventListener("raycaster-intersection",t=>{if(t.detail.intersections.length>0&&t.detail.intersections[0].distance>0){console.log("CRASH!",t.detail.els[0].tagName,t.detail.intersections[0].distance,e.gliderEl.getAttribute("raycaster").far,e.gliderSpeed/10),AFRAME.scenes[0].emit("hover",{}),new Howl({src:["../assets/198876__bone666138__crash.mp3"]}).play(),setTimeout(()=>{e.gliderSpeed>=30?(sessionStorage.setItem("returnWorld",location.pathname),location.pathname="/ginnungagap/"):(e.gliderPosition.x=e.gliderPositionStart.x,e.gliderPosition.y=e.gliderPositionStart.y,e.gliderPosition.z=e.gliderPositionStart.z,e.gliderRotationX=0,e.gliderRotationY=e.gliderRotationYStart,e.gliderSpeed=5,e.hudText="",e.cameraEl.object3D.rotation.x=0,e.cameraEl.object3D.rotation.y=0,e.cameraEl.object3D.rotation.z=0,setTimeout(this.showControlsReminder.bind(this,e),3e3))},2e3)}}),t.addEventListener("hitstart",t=>{t.detail.intersectedEls.forEach(t=>{if(t.classList.contains("powerup"))console.log("powerup"),e.gliderSpeed+=16,this.powerup.play();else if(t.classList.contains("star"))++e.stars,console.log("collected star",e.stars,"of",e.numYellowStars),t.parentNode.removeChild(t),this.ding.play();else if(t.classList.contains("proximitySound")){let e=t.getAttribute("data-sound-url"),n=t.getAttribute("data-sound-volume")||1;e&&new Howl({src:e,volume:n,autoplay:!0});let o=t.getAttribute("data-text"),i=AFRAME.scenes[0].querySelector("#subtitle");o&&i&&(i.setAttribute("value",o),setTimeout(()=>{i.setAttribute("value","")},5e3))}else t.components.link&&(console.log("hit link"),"/ginnungagap/"!==location.pathname&&sessionStorage.setItem("previousWorld",location.pathname))})}),document.addEventListener("keydown",function(t){e.cameraEl.getAttribute("rotation");switch(t.code){case"KeyA":case"ArrowLeft":e.cameraEl.object3D.rotation.z+=.07;break;case"KeyD":case"ArrowRight":e.cameraEl.object3D.rotation.z-=.07;break;case"KeyW":case"ArrowUp":e.cameraEl.object3D.rotation.x+=.045;break;case"KeyS":case"ArrowDown":e.cameraEl.object3D.rotation.x-=.045;break;case"Space":e.isFlying?e.debug&&AFRAME.scenes[0].emit("hover",t):AFRAME.scenes[0].emit("launch",t);break;case"Enter":e.hudVisible=!e.hudVisible}},!1)},buttondown:function(e,t){e.isFlying?e.debug&&AFRAME.scenes[0].emit("hover",t):AFRAME.scenes[0].emit("launch",t)},countYellowStars:function(e,t){e.numYellowStars=AFRAME.scenes[0].querySelectorAll(".star").length,console.log("numYellowStars:",e.numYellowStars),e.numYellowStars&&(this.ding=new Howl({src:["../assets/393633__daronoxus__ding.mp3"]}))},launch:function(e,t){console.log("launch",t),e.isFlying=!0,e.controlsReminderDisplayed=!1;let n=AFRAME.scenes[0].querySelector("#prelaunchHelp");n&&n.setAttribute("value",""),Object(o.b)()},hover:function(e,t){console.log("hover",t),e.isFlying=!1},loaded:function(e,t){document.getElementById("intro")||this.startInteraction(e)},"enter-vr":function(e){this.startInteraction(e)},"exit-vr":function(e,t){e.controlsReminderDisplayed&&this.showControlsReminder(e),document.getElementById("intro")&&AFRAME.scenes[0].emit("hover",t)},startInteraction:function(e){e.controlsReminderDisplayed?this.showControlsReminder(e):setTimeout(this.showControlsReminder.bind(this,e),6e3)},showControlsReminder:function(e){let t=AFRAME.scenes[0].querySelector("#prelaunchHelp"),n=document.getElementById("intro");!t||n&&!AFRAME.scenes[0].is("vr-mode")||e.isFlying||(e.controlsReminderDisplayed=!0,AFRAME.scenes[0].is("vr-mode")&&AFRAME.utils.device.checkHeadsetConnected()||AFRAME.utils.device.isMobileVR()?t.setAttribute("value","The wing above you\npoints where you're flying.\n\nTilt your head left: turn left\nTilt your head right: turn right\nTrigger or touchpad: launch"):AFRAME.utils.device.isMobile()?t.setAttribute("value","The wing above you\npoints where you're flying.\n\nRoll your device left: turn left\nRoll your device right: turn right\nTap screen: launch"):t.setAttribute("value","The wing above you\npoints where you're flying.\n\nA: turn left\nD: turn right\nW: climb (& slow down)\nS: descend (& speed up)\nSpace bar: launch"))},iterate:function(e,t){t.timeDelta=Math.min(t.timeDelta,100),e.time+=t.timeDelta*e.difficulty;let n=e.cameraEl.getAttribute("rotation");if(!n)return void console.warn("camera rotation not available");let i=(Object(o.d)()?n.x+20:n.x)-e.gliderRotationX,r=(i+15*Math.sign(i))*(t.timeDelta/1e3);Math.abs(r)>Math.abs(i)&&(r=i);let s=e.gliderRotationX+r;s=Math.max(s,-89),s=Math.min(s,89),e.gliderRotationX=s;let a=n.z-e.gliderRotationZ,l=(a+15*Math.sign(a))*(t.timeDelta/1e3);Math.abs(l)>Math.abs(a)&&(l=a);let d=e.gliderRotationZ+l;d=Math.max(d,-89),d=Math.min(d,89),e.gliderRotationZ=d;let c=e.gliderRotationZ*t.timeDelta/1e3;if(e.gliderRotationY=(e.gliderRotationY+c+180)%360-180,e.isFlying){let n=e.gliderSpeed*t.timeDelta/1e3,i=Object(o.a)(e.gliderRotationX,e.gliderRotationY+90,n),r=i.y;e.gliderPosition.x+=i.x,e.gliderPosition.y+=r,e.gliderPosition.z+=i.z;let s=(-Math.sign(r)*Math.sqrt(19.614*Math.abs(r))-5e-4*e.gliderSpeed*e.gliderSpeed)*t.timeDelta/1e3;e.gliderSpeed=Math.max(e.gliderSpeed+s,.1),e.gliderSpeed=Math.min(e.gliderSpeed,99.4),e.gliderSpeed<9.95?e.hudText=e.gliderSpeed.toFixed(1):e.hudText=e.gliderSpeed.toFixed(0),e.gliderEl.setAttribute("raycaster","far",e.gliderSpeed/10)}},placeInGliderPath:function(e,t){let n=e.gliderRotationX+(Math.random()-.5)*t.variation,i=e.gliderRotationY+90+(Math.random()-.5)*t.variation,r=Object(o.a)(n,i,t.distance),s={x:e.gliderPosition.x+r.x,y:e.gliderPosition.y+r.y,z:e.gliderPosition.z+r.z};t.el.setAttribute("position",s),t.el.setAttribute("rotation","y",e.gliderRotationY)},adjustForMagicWindow:function(e){Object(o.d)()?(e.object3D.rotation.x=THREE.Math.degToRad(-30),e.object3D.scale.set(1,1,3)):(e.object3D.rotation.x=0,e.object3D.scale.set(1,1,1))},adjustHudForVR:function(e){AFRAME.utils.device.isMobile()?(e.object3D.position.x=.2,e.object3D.position.y=.3):(e.object3D.position.x=.2,e.object3D.position.y=.42),e.object3D.rotation.x=THREE.Math.degToRad(30),e.object3D.rotation.y=THREE.Math.degToRad(-20)},adjustHudForFlat:function(e){Object(o.c)()?(e.object3D.position.x=.85,e.object3D.position.y=.5,e.object3D.rotation.x=0,e.object3D.rotation.y=0):(e.object3D.position.x=.7,e.object3D.position.y=.2,e.object3D.rotation.x=THREE.Math.degToRad(30),e.object3D.rotation.y=THREE.Math.degToRad(-20))}},computeState:function(e,t){try{let t=e.questComplete;if(e.questComplete=e.stars>=e.numYellowStars,e.questComplete&&!t){new Howl({src:["../assets/361684__taranp__horncall-strauss1-eflatmajor_incipit.mp3"]}).play()}}catch(e){console.error(e)}}}),AFRAME.registerComponent("armature-tick-state",{init:function(){AFRAME.scenes[0].emit("setArmatureEl",this.el)},tick:function(e,t){AFRAME.scenes[0].emit("iterate",{time:e,timeDelta:t})}})},function(e,t){
/*!
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
window.requestIdleCallback=window.requestIdleCallback||function(e){return setTimeout(function(){var t=Date.now();e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},window.cancelIdleCallback=window.cancelIdleCallback||function(e){clearTimeout(e)}},function(e,t,n){"use strict";var o=n(0);n(4);console.log("previousWorld:",sessionStorage.getItem("previousWorld")),sessionStorage.getItem("previousWorld")||document.addEventListener("DOMContentLoaded",function(e){let t="";window.hasNativeWebVRImplementation||(t='<div style="margin-top: 1em;">\nThis browser lacks <a href="https://webvr.info/">native WebVR</a>, so don\'t complain about performance. </div>');let n="";!AFRAME.utils.device.isMobile()||AFRAME.scenes[0]&&AFRAME.scenes[0].is("vr-mode")||(n='<div class="portraitOnly" style="color:red;margin-top: 1em;">\nPlease rotate your device to landscape mode. &#x21B6;</div>'),console.log("checkHeadsetConnected:",AFRAME.utils.device.checkHeadsetConnected()),console.log("isMobile:",AFRAME.utils.device.isMobile()),console.log("isMobileVR:",AFRAME.utils.device.isMobileVR()),console.log("hasNativeWebVRImplementation:",window.hasNativeWebVRImplementation);let i="",r='\n<table id="vrControls">\n    <tr><td colspan="2">The wing above you points the direction you\'re flying</td></tr>\n    <tr><td colspan="2"><b>Tap</b> headset button ➘ to enter VR mode</td></tr>\n    <tr><td><b>Tilt</b> your head left to turn glider left</td><td><img src="../assets/head-tilt-left.png"></td></tr>\n    <tr><td><b>Tilt</b> your head right to turn glider right</td><td><img src="../assets/head-tilt-right.png"></td></tr>\n    <tr><td colspan="2"><b>Turn</b> your head left or right to look around without turning glider</td></tr>\n    <tr><td colspan="2"><b>Tilt</b> your head up to climb (&amp; <b>slow down</b>)</td></tr>\n    <tr><td colspan="2"><b>Tilt</b> your head down to descend (&amp; <b>speed up</b>)</td></tr>\n    <tr><td colspan="2"><b>Press</b> trigger or touchpad to launch</td></tr>\n</table>\n';AFRAME.utils.device.isMobile()?(i='<div class="closeBtnRed landscapeOnly"></div>',r='\n<table class="landscapeOnly" style="width:100%">\n    <tr><td colspan="2">The wing above you points the direction you\'re flying</td></tr>\n    <tr><td colspan="2"><b>Tap</b> the close button ➚ to play in magic window mode, or <b>Tap</b> headset button ➘ and place phone in headset to enter VR mode</td></tr>\n    <tr><td><b>Roll</b> your device left to turn glider left</td>\n        <td><img src="../assets/device-rotate-ccw.png"></td></tr>\n    <tr><td><b>Roll</b> your device right to turn glider right</td>\n        <td><img src="../assets/device-rotate-cw.png"></td></tr>\n    <tr><td colspan="2"><b>Turn</b> your device left or right to look around without turning glider</td></tr>\n    <tr><td colspan="2"><b>Tilt</b> your device up to climb (&amp; <b>slow down</b>)</td></tr>\n    <tr><td colspan="2"><b>Tilt</b> your device down to descend (&amp; <b>speed up</b>)</td></tr>\n    <tr><td colspan="2"><b>Tap</b> the screen to launch</td></tr>\n</table>\n'):!AFRAME.utils.device.checkHeadsetConnected()&&Object(o.c)()&&(i='<div class="closeBtnRed"></div>',r='\n<table style="width:100%">\n    <tr><td colspan="2">Elfland Glider is designed for VR or mobile, but if you want to try it here:</td></tr>\n    <tr><td colspan="2">The wing above you points the direction you\'re flying</td></tr>\n    <tr><td>A or left-arrow</td><td>turn glider left</td></tr>\n    <tr><td>D or right-arrow</td><td>turn glider right</td></tr>\n    <tr><td>W or up-arrow</td><td>climb (&amp; <b>slow down</b>)</td></tr>\n    <tr><td>S or down-arrow</td><td>descend (&amp; <b>speed up</b>)</td></tr>\n    <tr><td>space bar</td><td>launch</td></tr>\n    <tr><td>headset button ➘</td><td>enter fullscreen mode</td></tr>\n</table>\n');let s=`\n${i}\n<h1 style="text-align:center;">Elfland Glider</h1>\n    <div class="wrapper">\n      <div id="overview">\n        Fly through fantastic worlds,\n        help the merry and mischievous light elves,\n        & avoid the surly and mischievous dark elves.\n        ${n}\n        ${t}\n      </div>\n      ${r}\n      <div style="font-family:serif; font-size: 0.75rem">\n        <div>${atob("ZS1tYWlsOiA8YSBocmVmPSJtYWlsdG86dnJAaG9taW5pZHNvZnR3YXJlLmNvbT9zdWJqZWN0PUVsZmxhbmQlMjBHbGlkZXImYm9keT0=")+encodeURIComponent("\n\n\n"+navigator.userAgent+"\n\n\n")+atob("Ij52ckBob21pbmlkc29mdHdhcmUuY29tPC9hPg==")}</div>\n        <div><a href="../CREDITS.md">Credits</a></div>\n        <div>Uses <a href="https://webvr.info/">WebVR</a> and <a href="https://aframe.io"><nobr>A-Frame</nobr></a>.</div>\n        <div>Copyright © 2017-2019 by P. Douglas Reeder; Licensed under the GNU GPL-3.0</div>\n        <div><a href="https://github.com/DougReeder/elfland-glider">View source code and contribute</a> </div>\n      </div>\n    </div>\n`,a=document.createElement("div");a.setAttribute("id","intro"),a.setAttribute("style","position:fixed; top:0; bottom:0; left:0; right:0;\n                background: rgba(255,255,255,0.75);\n                overflow-y: scroll"),a.innerHTML=s,document.body.appendChild(a);let l=a.querySelector(".closeBtnRed");l&&l.addEventListener("click",function e(t){console.log("closeBtn click",t);document.body.removeChild(a);l.removeEventListener("click",e);AFRAME&&AFRAME.scenes[0]&&AFRAME.scenes[0].emit("startInteraction");Object(o.b)()})})},function(e,t,n){var o=n(5);"string"==typeof o&&(o=[[e.i,o,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(9)(o,i);o.locals&&(e.exports=o.locals)},function(e,t,n){t=e.exports=n(6)(!1);var o=n(7)(n(8));t.push([e.i,'/** intro.css - styling for intro dialog of Elfland Glider\n  * Copyright © 2018-2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0\n  */\n\n\nhtml {\n    font: 1.5rem Niconne, "Goudy Old Style", Papyrus, serif;\n}\n\nh1 {\n    margin: 0.5em;\n}\n\n.wrapper {\n    margin: 1em;\n}\n.wrapper > * {\n    margin: 1em;\n}\n@supports (display: grid) {\n    .wrapper {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));\n        grid-gap: 1em;\n        gap: 1em;\n    }\n    .wrapper > * {\n        margin: 0;\n    }\n}\n\n.portraitOnly {\n    display: none;\n}\n.landscapeOnly {\n    display: block;\n}\n@media only screen and (orientation: portrait) {\n    .portraitOnly {\n        display: block;\n    }\n    .landscapeOnly {\n        display: none;\n    }\n}\n\n\n.closeBtnRed {\n    position: fixed;\n    top: 25px;\n    right: 25px;\n    width: 32px;\n    height: 32px;\n    background-image: url('+o+");\n    z-index: 1;\n}\n\n\n\n/* forces scrollbar to be visible in webkit browsers */\n::-webkit-scrollbar {\n    width:9px;\n}\n\n::-webkit-scrollbar-track {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.1);\n}\n\n::-webkit-scrollbar-thumb {\n    -webkit-border-radius:5px;\n    border-radius:5px;\n    background:rgba(0,0,0,0.2);\n}\n\n::-webkit-scrollbar-thumb:hover {\n    background:rgba(0,0,0,0.4);\n}\n\n::-webkit-scrollbar-thumb:window-inactive {\n    background:rgba(0,0,0,0.05);\n}\n",""])},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=(s=o,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),r=o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"});return[n].concat(r).concat([i]).join("\n")}var s;return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];null!=r&&(o[r]=!0)}for(i=0;i<e.length;i++){var s=e[i];null!=s[0]&&o[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(e,t,n){"use strict";e.exports=function(e,t){return"string"!=typeof e?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),/["'() \t\n]/.test(e)||t?'"'+e.replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"':e)}},function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94GFwMDIcNssL0AAAJJSURBVFjDzZc7S2NRFIVXxsc1iAoa3yiiEBAfoEim0ammEQMWFhZCOgvBwn/gDxD/RDobBeuAMI1OZxcDQsIgQUFERXFA4zfFNYma+zh3Jo5ZsLt979pn733W3iekAEAakvRN0ndJXyVFJf2W9EvST0kpST9CUk7VApKFlEB6QMLQHl6+sf6VPB6A1M3if3vqZBXIi5Y0zgZSK1KmiuRFyyC1mpz8I8hfB2F5BZD8QPJSOYI1XDgMa2uwuQlNTf4E7e2wtQWLi1BXZ9aYL6mvdGxogHyeEq6uIBZzJ19dhefnsv/Ojlew1usAEo5Oy8tU4PoapqYqfVdW3pIDPD1Bb69bAInXATiLzNwcjri7g4mJst/8vE32Hjc30NzsKlYlefWs6fGxcxCXlzA8DAsLUCg4+2xv+/XMkHv6i9bZCem0M8HFhfPJAfb2oL7eL4CE2dWLRCCTwRipFDQ2ml1JY+GJRCCb9Sc/PATLMhYmBZpyg4N27d1wdGRf3QBT80ugKRUO2+aG7m6prS3w5DMrwcAAnJ/7lyCfh76+QCXwb8L+fsjlzJvw5AQ6Ooyb0Psa9vTA6akzUTZry7MT0mno6jK6ht5CdHDgTHB2ZmvE+Djc3zv77O76C5GnFI+OuqvgyEjZLxp1zsTjo51BLyn2HEZjY5U/vb2FyclK3+lpe1C9nwUtLUbDyHJN0/7+27TPzLinNBYrB1EowMaG2Tj23YBnZ2F93WvBeGtLS37LS7z2VrKaWEo/fS2viYdJTTzN/ufjNPTZz/M/sV5aEsIQ08UAAAAASUVORK5CYII="},function(e,t,n){var o,i,r={},s=(o=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=o.apply(this,arguments)),i}),a=function(e){var t={};return function(e,n){if("function"==typeof e)return e();if(void 0===t[e]){var o=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,n);if(window.HTMLIFrameElement&&o instanceof window.HTMLIFrameElement)try{o=o.contentDocument.head}catch(e){o=null}t[e]=o}return t[e]}}(),l=null,d=0,c=[],u=n(10);function p(e,t){for(var n=0;n<e.length;n++){var o=e[n],i=r[o.id];if(i){i.refs++;for(var s=0;s<i.parts.length;s++)i.parts[s](o.parts[s]);for(;s<o.parts.length;s++)i.parts.push(v(o.parts[s],t))}else{var a=[];for(s=0;s<o.parts.length;s++)a.push(v(o.parts[s],t));r[o.id]={id:o.id,refs:1,parts:a}}}}function f(e,t){for(var n=[],o={},i=0;i<e.length;i++){var r=e[i],s=t.base?r[0]+t.base:r[0],a={css:r[1],media:r[2],sourceMap:r[3]};o[s]?o[s].parts.push(a):n.push(o[s]={id:s,parts:[a]})}return n}function h(e,t){var n=a(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=c[c.length-1];if("top"===e.insertAt)o?o.nextSibling?n.insertBefore(t,o.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),c.push(t);else if("bottom"===e.insertAt)n.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=a(e.insertAt.before,n);n.insertBefore(t,i)}}function b(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=c.indexOf(e);t>=0&&c.splice(t,1)}function g(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var o=function(){0;return n.nc}();o&&(e.attrs.nonce=o)}return m(t,e.attrs),h(e,t),t}function m(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function v(e,t){var n,o,i,r;if(t.transform&&e.css){if(!(r="function"==typeof t.transform?t.transform(e.css):t.transform.default(e.css)))return function(){};e.css=r}if(t.singleton){var s=d++;n=l||(l=g(t)),o=w.bind(null,n,s,!1),i=w.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",m(t,e.attrs),h(e,t),t}(t),o=function(e,t,n){var o=n.css,i=n.sourceMap,r=void 0===t.convertToAbsoluteUrls&&i;(t.convertToAbsoluteUrls||r)&&(o=u(o));i&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var s=new Blob([o],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}.bind(null,n,t),i=function(){b(n),n.href&&URL.revokeObjectURL(n.href)}):(n=g(t),o=function(e,t){var n=t.css,o=t.media;o&&e.setAttribute("media",o);if(e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}.bind(null,n),i=function(){b(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else i()}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=s()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=f(e,t);return p(n,t),function(e){for(var o=[],i=0;i<n.length;i++){var s=n[i];(a=r[s.id]).refs--,o.push(a)}e&&p(f(e,t),t);for(i=0;i<o.length;i++){var a;if(0===(a=o[i]).refs){for(var l=0;l<a.parts.length;l++)a.parts[l]();delete r[a.id]}}}};var y,A=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function w(e,t,n,o){var i=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=A(t,i);else{var r=document.createTextNode(i),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(r,s[t]):e.appendChild(r)}}},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,o=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var i,r=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(r)?e:(i=0===r.indexOf("//")?r:0===r.indexOf("/")?n+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")})}},,,,,,,,function(e,t,n){"use strict";n.r(t);var o=n(0);n(1),n(3);AFRAME.registerComponent("yggdrasil",{init:function(){if(Object(o.e)("Swell2b-64k.mp3",.3),this.positionSph=new THREE.Spherical(1,Math.PI/2,0),this.position=new THREE.Vector3,this.sss=document.querySelector("a-simple-sun-sky"),this.directional=document.getElementById("directional"),"/island/"===sessionStorage.getItem("previousWorld")){AFRAME.scenes[0].querySelector("#prelaunchHelp").setAttribute("value","Congratulations!\\nYou've completed the main quests.\\nExplore all the worlds!")}},tick:function(e){this.positionSph.phi=.5*Math.PI+.8*Math.sin(e/12e4*2*Math.PI),this.positionSph.theta=.25*Math.PI+1*Math.sin(e/24e4*2*Math.PI),this.position.setFromSpherical(this.positionSph);let t=this.position.x+" "+this.position.y+" "+this.position.z;this.sss.setAttribute("sun-position",t),this.directional.setAttribute("position",t)}})}]);
//# sourceMappingURL=yggdrasil.js.map