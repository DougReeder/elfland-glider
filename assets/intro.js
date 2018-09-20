/** intro.js - introductory text for an Elfland Glider world
 * Copyright © 2018 P. Douglas Reeder; Licensed under the GNU GPL-3.0
 */

console.log("previousWorld:", sessionStorage.getItem('previousWorld'), Boolean(sessionStorage.getItem('previousWorld')));
if (! sessionStorage.getItem('previousWorld')) {
    document.addEventListener("DOMContentLoaded", function (details) {

        let styleLinkEl = document.createElement('link');
        styleLinkEl.setAttribute('rel', 'stylesheet');
        styleLinkEl.setAttribute('href', '../assets/intro.css');
        document.head.appendChild(styleLinkEl);


        let nativeVrHtml = '';
        if (!window.hasNativeWebVRImplementation) {
            nativeVrHtml = `<div style="margin-top: 1em;">
This browser lacks <a href="https://webvr.info/">native WebVR</a>, so don't complain about performance. </div>`;
        }

        let rotateHtml = '';
        if (AFRAME.utils.device.isMobile() && !AFRAME.utils.device.isGearVR() && !(AFRAME.scenes[0] && AFRAME.scenes[0].is("vr-mode"))) {
            rotateHtml = `<div class="portraitOnly" style="color:red;margin-top: 1em;">
Please rotate your device to landscape mode. &#x21B6;</div>`;
        }

        console.log("checkHeadsetConnected:", AFRAME.utils.device.checkHeadsetConnected());
        console.log("isMobile:", AFRAME.utils.device.isMobile());
        console.log("hasNativeWebVRImplementation:", window.hasNativeWebVRImplementation);
        closeBtnHtml = '';
        let controlsHtml = `
<table id="vrControls">
    <tr><td colspan="2">The gray triangle above you points the direction you're flying</td></tr>
    <tr><td colspan="2"><b>Tap</b> headset button ➘ to enter VR mode</td></tr>
    <tr><td><b>Tilt</b> your head left to turn glider left</td><td><img src="../assets/head-tilt-left.png"></td></tr>
    <tr><td><b>Tilt</b> your head right to turn glider right</td><td><img src="../assets/head-tilt-right.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your head left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head down to descend (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Press</b> trigger or touchpad to launch</td></tr>
</table>
`;
        if (AFRAME.utils.device.isMobile() && !AFRAME.utils.device.isGearVR()) {
            closeBtnHtml = `<div class="closeBtnRed landscapeOnly"></div>`;
            controlsHtml = `
<table class="landscapeOnly" style="width:100%">
    <tr><td colspan="2">The gray triangle above you points the direction you're flying</td></tr>
    <tr><td colspan="2"><b>Tap</b> the close button ➚ to play in magic window mode, or <b>Tap</b> headset button ➘ and place phone in headset to enter VR mode</td></tr>
    <tr><td><b>Roll</b> your device left to turn glider left</td>
        <td><img src="../assets/device-rotate-ccw.png"></td></tr>
    <tr><td><b>Roll</b> your device right to turn glider right</td>
        <td><img src="../assets/device-rotate-cw.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your device left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device down to descend (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Tap</b> the screen to launch</td></tr>
</table>
`;
        } else if (!AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
            closeBtnHtml = `<div class="closeBtnRed"></div>`;
            controlsHtml = `
<table style="width:100%">
    <tr><td colspan="2">Elfland Glider is designed for VR or mobile, but if you want to try it here:</td></tr>
    <tr><td colspan="2">The gray triangle above you points the direction you're flying</td></tr>
    <tr><td>A or left-arrow</td><td>turn glider left</td></tr>
    <tr><td>D or right-arrow</td><td>turn glider right</td></tr>
    <tr><td>W or up-arrow</td><td>climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td>S or down-arrow</td><td>descend (&amp; <b>speed up</b>)</td></tr>
    <tr><td>space bar</td><td>launch</td></tr>
    <tr><td>headset button ➘</td><td>enter fullscreen mode</td></tr>
</table>
`;
        }

        let html = `
${closeBtnHtml}
<h1 style="text-align:center;">Elfland Glider</h1>
    <div class="wrapper">
      <div id="overview">
        Fly through fantastic worlds,
        help the merry and mischievous light elves,
        & avoid the surly and mischievous dark elves.
        ${nativeVrHtml}
        ${rotateHtml}
      </div>
      ${controlsHtml}
      <div style="font-family:serif; font-size: 0.75rem">
        <div><a href="../CREDITS.md">Credits</a></div>
        <div>Uses <a href="https://webvr.info/">WebVR</a> and <a href="https://aframe.io"><nobr>A-Frame</nobr></a>.</div>
        <div>Copyright © 2017-2018 by P. Douglas Reeder; Licensed under the GNU GPL-3.0</div>
        <div><a href="https://github.com/DougReeder/elfland-glider">View source code and contribute</a> </div>
      </div>
    </div>
`;

        let introEl = document.createElement('div');
        introEl.setAttribute('id', 'intro');
        introEl.setAttribute('style', `position:fixed; top:35px; bottom:35px; left:35px; right:35px;
                background: rgba(255,255,255,0.75);
                overflow-y: scroll`);

        introEl.innerHTML = html;

        document.body.appendChild(introEl);


        let closeBtn = introEl.querySelector('.closeBtnRed');
        if (closeBtn) {
            closeBtn.addEventListener('click', handleCloseClick);
        }

        function handleCloseClick(evt) {
            console.log("closeBtn click", evt);
            document.body.removeChild(introEl);
            closeBtn.removeEventListener('click', handleCloseClick);

            AFRAME && AFRAME.scenes[0] && AFRAME.scenes[0].emit('startInteraction');
        }
    });
}
