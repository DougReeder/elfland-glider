/** intro.js - introductory text for an Elfland Glider world
 * Copyright © 2018-2023 P. Douglas Reeder; Licensed under the GNU GPL-3.0
 */

import {goFullscreenLandscape, isDesktop, pokeEnvironmentalSound} from './elfland-utils'
import '../assets/intro.css'

console.log("previousWorld:", sessionStorage.getItem('previousWorld'));
if (! sessionStorage.getItem('previousWorld') && !window.hasOwnProperty('jasmine')) {
    document.addEventListener("DOMContentLoaded", function (details) {
      const world = /([^/]+\/)[^/]*$/.exec(location.pathname)?.[1] || '';
      const cannonicalURL = new URL(world, 'https://dougreeder.github.io/elfland-glider/');

        let nativeXrHtml = '';
        if (!window.hasNativeWebXRImplementation && !window.hasNativeWebVRImplementation) {
            nativeXrHtml = `<div style="margin-top: 1em;">
This browser lacks both <a rel="noopener" href="https://caniuse.com/#search=webxr">native WebXR</a> and <a rel="noopener" href="https://webvr.info/">native WebVR</a>, so don't complain about performance. </div>`;
        }

        let rotateHtml = '';
        if (AFRAME.utils.device.isMobile() && !(AFRAME.scenes[0] && AFRAME.scenes[0].is("vr-mode"))) {
            rotateHtml = `<div class="portraitOnly" style="color:red;margin-top: 1em;">
Please rotate your device to landscape mode. &#x21B6;</div>`;
        }

        console.log("checkHeadsetConnected:", AFRAME.utils.device.checkHeadsetConnected());
        let closeBtnHtml = '';
        let controlsHtml = `
<table id="vrControls">
    <tr><td colspan="2">If you have a controller: <b>Click</b> VR button ➘ to enter VR mode, then...</td></tr>
    <tr><td colspan="2"><b>Press & Release</b> trigger, button or touchpad to grab (or release) the virtual control stick</td></tr>
    <tr><td><b>Tilt</b> the stick left to turn glider left</td><td><img src="../assets/control-bar-left.png"></td></tr>
    <tr><td><b>Tilt</b> the stick right to turn glider right</td><td><img src="../assets/control-bar-right.png"></td></tr>
    <tr><td colspan="2"><b>Tilt</b> the stick back to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> the stick forward to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Press</b> trigger, button or touchpad to launch</td></tr>
</table>
<table id="vrControls">
    <tr><td colspan="2">Without a controller...</td></tr>
    <tr><td colspan="2"><b>Click</b> VR button ➘ to enter VR mode</td></tr>
    <tr><td><b>Tilt</b> your head left to turn glider left</td><td><img src="../assets/head-tilt-left.png"></td></tr>
    <tr><td><b>Tilt</b> your head right to turn glider right</td><td><img src="../assets/head-tilt-right.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your head left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your head down to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Pinch</b> fingers, or <b>Press</b> trigger, button or touchpad to launch</td></tr>
</table>
`;
        if (AFRAME.utils.device.isMobile()) {
            closeBtnHtml = `<div class="closeBtnRed landscapeOnly"></div>`;
            controlsHtml = `
<table class="landscapeOnly" style="width:100%">
    <tr><td colspan="2"><b>Tap</b> the close button ➚ to play in magic window mode, or <b>Tap</b> VR button ➘ and place phone in headset to enter VR mode</td></tr>
    <tr><td><b>Roll</b> your device left to turn glider left</td>
        <td><img src="../assets/device-rotate-ccw.png"></td></tr>
    <tr><td><b>Roll</b> your device right to turn glider right</td>
        <td><img src="../assets/device-rotate-cw.png"></td></tr>
    <tr><td colspan="2"><b>Turn</b> your device left or right to look around without turning glider</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device up to climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td colspan="2"><b>Tilt</b> your device down to dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td colspan="2"><b>Tap</b> the screen to launch</td></tr>
    <tr><td colspan="2" class="ruleAbove"><a rel="noopener" href="https://www.oculus.com/open_url/?url=${encodeURIComponent(cannonicalURL)}">Send this page</a> to your Quest headset</td></tr>
</table>
`;
        } else if (!AFRAME.utils.device.checkHeadsetConnected() && isDesktop()) {
            closeBtnHtml = `<div class="closeBtnRed"></div>`;
            controlsHtml = `
<table style="width:100%">
    <tr><td colspan="2"><a rel="noopener" href="https://www.oculus.com/open_url/?url=${encodeURIComponent(cannonicalURL)}">Send this page</a> to your Quest headset</td></tr>
    <tr><td colspan="2" class="ruleAbove">Elfland Glider is designed for VR or mobile, but if you want to try it here:</td></tr>
    <tr><td>A or left-arrow</td><td>turn glider left</td></tr>
    <tr><td>D or right-arrow</td><td>turn glider right</td></tr>
    <tr><td>W or up-arrow</td><td>climb (&amp; <b>slow down</b>)</td></tr>
    <tr><td>S or down-arrow</td><td>dive (&amp; <b>speed up</b>)</td></tr>
    <tr><td>space bar</td><td>launch</td></tr>
    <tr><td>VR button ➘</td><td>enter fullscreen mode</td></tr>
</table>
`;
        }

        let mt = atob("ZS1tYWlsOiA8YSBocmVmPSJtYWlsdG86dnJAaG9taW5pZHNvZnR3YXJlLmNvbT9zdWJqZWN0PUVsZmxhbmQlMjBHbGlkZXImYm9keT0=") +
            encodeURIComponent("\n\n\n" + navigator.userAgent + "\n\n\n") +
            atob("Ij52ckBob21pbmlkc29mdHdhcmUuY29tPC9hPg==");

        let html = `
${closeBtnHtml}
<h1 style="text-align:center;">Elfland Glider</h1>
    <div class="wrapper">
      <div id="overview">
        Fly through fantastic worlds,
        help the merry and mischievous light elves,
        & avoid the surly and mischievous dark elves.
        ${rotateHtml}
        ${nativeXrHtml}
        <table id="vrControls">
            <tr><td colspan="2" class="ruleAbove">Remain seated while learning to fly</td></tr>
            <tr><td colspan="2">The wing above you points the direction you're flying</td></tr>
        </table>
      </div>
      ${controlsHtml}
      <div style="font-family:serif; font-size: 0.75rem">
        <div>${mt}</div>
        <div><a href="../CREDITS.md">Credits</a></div>
        <div>Uses <a rel="noopener" href="https://caniuse.com/#search=webxr">WebXR</a> or <a href="https://webvr.info/">WebVR</a>, and the <a href="https://aframe.io"><nobr>A-Frame</nobr></a> framework.</div>
        <div>Copyright © 2017-2023 by Doug Reeder; Licensed under the GNU GPL-3.0</div>
        <div><a rel="noopener" href="https://github.com/DougReeder/elfland-glider">View source code and contribute</a> </div>
      </div>
    </div>
`;

        let introEl = document.createElement('div');
        introEl.setAttribute('id', 'intro');
        introEl.setAttribute('style', `position:fixed; top:0; bottom:0; left:0; right:0;
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

            goFullscreenLandscape();

            pokeEnvironmentalSound();
        }
    });
}
