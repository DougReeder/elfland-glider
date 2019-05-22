// arches.js - prototype world for Elfland Glider
// Copyright © 2019 P. Douglas Reeder; Licensed under the GNU GPL-3.0

import '../src/state.js'
import '../assets/stella-octangula'
import '../src/intro.js'

AFRAME.registerComponent('arches', {
    init: function () {
        this.el.emit('countYellowStars', {});
    }
});
