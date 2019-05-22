# Elfland Glider

Fly through fantastic worlds, 
help the merry and mischievous light elves, 
and avoid the surly and mischievous dark elves.

A tranquil action game for VR and mobile 
using [WebVR](https://webvr.info/) and [A-Frame](https://aframe.io).

Roll left to turn left, Roll right to turn right. 
Tilt up to ascend, trading speed for altitude.
Tilt down to dive, trading altitude for speed.
Collect a powerup to gain speed.
~~Ride a thermal to gain altitude.~~
Press trigger or touchpad to take a (context-specific) action, such as launching.

[Play on-line](https://elfland-glider.surge.sh/)

## Gameplay
Gliding is controlled by headset orientation. 
Yawing the head left or right does *not* control the glider,
so the player can look other directions than the direction of travel.

Most quests are playable without a controller.
~~Some later quests require a “magic wand” (3-DOF controller).~~

A typical quest has the player glide around, exploring the world and possibly acquiring a tool or two.
One or more challenges arise, which the player must solve using adroit flying and possibly tools.
Then a portal to the next quest (or set of quests) opens.

There is no health nor lives, and no leveling up. 
A normal landing or crash just moves the player back to the launch point, as if he/she had walked and/or swum there.
A high-velocity crash or landing on lava sends the player to dreary Ginnungagap,
to fly through mists for a minute or two, before a portal appears to take him/her back.

Tools are usually not retained for future quests, and may or may not be useful (or required) later.

Favor engagement over realism.  It should be rewarding to fly around and explore.
Game objectives should just be the icing on the cake.

Constraints and difficulties are almost entirely integrated into the worlds, not pasted atop them.
The landscape forms an obstacle course for the player to slalom through.
Time constraints can come from a gate that opens and closes on a schedule,
or from a course than can only be navigated during daylight, with daylight only lasting a few minutes.
Rain and fog can obscure passages or tools.
A few clues should only be visible when the player looks to the side.

Quests may be implicit in the arrangement of objects, 
or can be explicitly spelled out by text floating in air.
Favor showing over telling, but a well-chosen sentence can be worth a dozen pictures.
For example: “Collect all the stars”.
You can label landmarks, tools, and other plot elements, if needed, but avoid expository lumps.

Worlds should be designed for VR, but playable on mobile.
They should be runnable on a desktop without VR, but it's okay if the quests are not be completable using only keyboard controls.


## Theme
Worlds are fantastic, with geography impossible in our world - but self-consistent.
A river could flow in a closed loop.
Islands can float in the sky.
Trees can be miles tall.
Houses might be too small to live in or absurdly large.
Days may consist of a half-dozen minutes of light, followed by a minute of twilight.
Or, the sun might traverse a figure-8 in the sky.
Ocean waves could be 100 m tall.
Elfland Glider is *not* cutsey nor childish,
but omit anything inappropriate for children.
Humor should not disrupt the flow of the game -
you can have a light elf warn the player not to taunt the Gazebo or seek the "scarlet emerald".
The player might find the tool "Gauntlets of Ogre Intelligence".

Perhaps the best description of elves, light or dark, is if they came across you, treed by a bear, 
they would weave a daisy-chain and set it around the bear's neck, so your tale wasn't tragic.
"Light" and "dark" are human adjectives applied subjectively,
there's not an inherent difference between them.

Light elves (there are many kinds) are generally flighty and impractical.
Some fly and some don't.
They might ask a "big person" like the player to move some heavy object,
when the sensible thing would have been to not build it like that.
A cavalcade might accompany the player, when the player would prefer to be unobtrusive.

There are no malicious enemies to be defeated.
Animals may attack if provoked.
Dark elves (there are many kinds) are protective of their homes and works.
Some fly and some don't.
Normally, the player should avoid them.
If the player must "borrow" an object of theirs, they will give chase,
launching attacks which hinder the player.

## Aesthetic Design

Main levels must run at 60 fps on smartphones such as the Galaxy S7, and there is not yet much support for progressive enhancement.
So, realistic rendering is not possible, in general.

Space and motion are key themes. Draw inspiration from nature, Alexander Calder mobiles, and modern dance.

Players are moving around at speed, thus almost any object may be viewed from near or far - 
but only briefly. Visual design should favor *legibility* over realism or involved detail.
The player must be able to see at a glance that a boulder is made of *ice*, and so infer that it will *float*.
It must be obvious that a river is *lava*, and so infer that *ice will melt near it*.
Favor compound curves over angular or blocky shapes, and especially avoid pixellation and voxellation.
Smooth noise is good for this - it shows detail up close and does not repeat.
Generate landscape and the location of plot tokens proceedurally, if you can.
That enhances replay value.
If the sun does not move, bake the effect of sunlight into the color of objects. 

Shadows and post-effects shouldn't be necessary.
Take advantage of cheap graphics processor effects like particles and UV scrolling.

Repetitive animations are boring.
Put effort into making motion interesting. 
Make orbits non-circular, use Brownian motion, flocking behavior,
or use a dynamic model using the player's location.

Every world should have sound, if only a global background of wind or water flowing.
Take advantage of spatial audio. A waterfall which roars when you're near can get by with less animation. 

Check out  [Where can I find assets?](https://aframe.io/docs/0.8.0/introduction/faq.html#where-can-i-find-assets)

You should use [aframe-look-controls-z](https://www.npmjs.com/package/aframe-look-controls-z) instead of 
aframe-look-controls, so in magic window mode, the virtual horizon stays parallel to the real horizon.

You probably should use [aframe-simple-sun-sky](https://www.npmjs.com/package/aframe-simple-sun-sky) to save the GPU
for the terrain (unless it's night).

Consider whether [aframe-dust-component](https://www.npmjs.com/package/aframe-dust-component) would help the user
orient him/herself.  (For Safari or Edge, you should polyfill requestIdleCallback.)


## Developing

`npm install && npm build && npm start`

`open http://localhost:3000/`

***

## Still need Help?

### Installation

First make sure you have Node installed.

On Mac OS X, it's recommended to use [Homebrew](http://brew.sh/) to install Node + [npm](https://www.npmjs.com):

    brew install node

To install the Node dependencies:

    npm install


### Local Development

To serve the site from a simple Node development server:

	npm build
    npm start

Then launch the site from Firefox or another WebVR-supporting browser:

[__http://localhost:3000/__](http://localhost:3000/)

If you wish to serve the site from a different port:

    PORT=8000 npm start

Run the automated tests before submitting a pull request:

	npm test

## License

This program is free software and is distributed under a [GNU GPL-3 License](LICENSE).
