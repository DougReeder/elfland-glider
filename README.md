# Elfland Glider

Fly through fantastic worlds, 
help the merry and mischievous light elves, 
and avoid the surly and mischievous dark elves.

A tranquil action puzzle game for VR and mobile 
using [WebVR](https://webvr.info/) and [A-Frame](https://aframe.io).

Tilt left to turn left, tilt right to turn right. 
Tilt up to ascend, trading speed for altitude.
Tilt down to dive, trading altitude for speed.
Ride a thermal to gain altitude.
Press any controller button to take a context-specific action.

## Gameplay
Gliding is controlled by headset tilt. 
Yawing the head left or right does *not* control the glider,
so the player can look other directions than the direction of travel.

Most quests are playable without a controller.
Some later quests require a wand (3-DOF) controller.

A typical quest has the player glide around, exploring the world and possibly acquiring a tool or two.
One or more challenges arise, which the player must solve using adroit flying and possibly tools.
Then a portal to the next quest (or set of quests) opens.

There is no health nor lives, and no leveling up. 
A normal landing or crash should just move the player back to a launch point, as if he/she had walked and/or swum there.
A high-velocity crash or landing on lava could send the player to a dreary world, to fly through mists for a minute or two, before a portal appears to take him/her back.

Tools are usually not retained for future quests, and may or may not be useful (or required) later.

Constraints and difficulties are almost entirely integrated into the worlds, not pasted atop them.
The landscape forms an obstacle course for the player to slalom through.
Time constraints can come from a gate that opens and closes on a schedule,
or from a course than can only be navigated during daylight, and daylight only lasting a few minutes.
A few clues should only be visible when the player looks to the side.

Quests may be implicit in the arrangement of objects, 
or can be explicitly spelled out by text floating in nothing.
Favor showing over telling, but a well-chosen sentence can be worth a dozen pictures.
You can label landmarks, tools, and other plot elements, if needed, but avoid expository lumps.

## Theme
Worlds are fantastic, with geography impossible in our world - but self-consistent.
A river could flow in a closed loop.
Islands can float in the sky.
Trees can be miles tall.
Houses might be too small to live in or absurdly large.
Days may consist of a half-dozen minutes of light, followed by a minute of twilight.
Ocean waves could be 100 m tall.
Elfland Glider is *not* cutsey nor childish.
Humor should not disrupt the flow of the game -
you can have a light elf warn the player not to taunt the Gazebo or seek the "scarlet emerald"
or create "Gauntlets of Ogre Intelligence" for the player to equip.

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




## Developing
For now, there is no build step.

`npm install && npm start`

`open http://localhost:3000/`

***


## Publishing your scene

If you don't already know, GitHub offers free and awesome publishing of static sites through __[GitHub Pages](https://pages.github.com/)__.

To publish your scene to your personal GitHub Pages:

    npm run deploy

And, it'll now be live at __http://`your_username`.github.io/__ :)

<hr>

To know which GitHub repo to deploy to, the `deploy` script first looks at the optional [`repository` key](https://docs.npmjs.com/files/package.json#repository) in the [`package.json` file](package.json) (see [npm docs](https://docs.npmjs.com/files/package.json#repository) for sample usage). If the `repository` key is missing, the script falls back to using the local git repo's remote origin URL (you can run the local command `git remote -v` to see all your remotes; also, you may refer to the [GitHub docs](https://help.github.com/articles/about-remote-repositories/) for more information).

<hr>

## Still need Help?

### Installation

First make sure you have Node installed.

On Mac OS X, it's recommended to use [Homebrew](http://brew.sh/) to install Node + [npm](https://www.npmjs.com):

    brew install node

To install the Node dependencies:

    npm install


### Local Development

To serve the site from a simple Node development server:

    npm start

Then launch the site from your favourite browser:

[__http://localhost:3000/__](http://localhost:3000/)

If you wish to serve the site from a different port:

    PORT=8000 npm start


## License

This program is free software and is distributed under a [GNU GPL-3 License](LICENSE).
