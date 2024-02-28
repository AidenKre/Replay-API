"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortalHit = null;
        this.mHeroHit = null;

        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mCollide = null;
        this.mChoice = 'H';

        this.mRecorderManager = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 400, 400]           // viewport (orgX, orgY, width, height)
        );
        this.mPlaybackCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [400, 0, 400, 480]           // viewport (orgX, orgY, width, height)
        )
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        this.mPlaybackCamera.setBackgroundColor([0.5, 0.5, 0.5, 1]);
        // sets the background to darker grey

        this.mBrain = new Brain(this.kMinionSprite);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.kMinionSprite);

        this.mPortalHit = new DyePack(this.kMinionSprite);
        this.mPortalHit.setVisibility(false);
        this.mHeroHit = new DyePack(this.kMinionSprite);
        this.mHeroHit.setVisibility(false);

        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mCollide = this.mHero;
        this.mRecorderManager = new engine.RecorderManager(this.mHero)
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Draw everything
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        this.mPortalHit.draw(this.mCamera);
        this.mHeroHit.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        let msg = "L/R: Left or Right Minion; H: Dye; B: Brain]: ";

        this.mLMinion.update();
        this.mRMinion.update();
        this.mRecorderManager.update();
        this.mHero.update();

        this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
            engine.input.keys.Left, engine.input.keys.Right, engine.input.keys.P);

        let h = [];

        // Portal intersects with which ever is selected
        if (this.mPortal.pixelTouches(this.mCollide, h)) {
            this.mPortalHit.setVisibility(true);
            this.mPortalHit.getXform().setXPos(h[0]);
            this.mPortalHit.getXform().setYPos(h[1]);
        } else {
            this.mPortalHit.setVisibility(false);
        }

        // hero always collide with Brain (Brain chases hero)
        if (!this.mHero.pixelTouches(this.mBrain, h)) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.05);
            engine.GameObject.prototype.update.call(this.mBrain);
            this.mHeroHit.setVisibility(false);
        } else {
            this.mHeroHit.setVisibility(true);
            this.mHeroHit.getXform().setPosition(h[0], h[1]);
        }

        // decide which to collide
        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            this.mCollide = this.mLMinion;
            this.mChoice = 'L';
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mCollide = this.mRMinion;
            this.mChoice = 'R';
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mCollide = this.mBrain;
            this.mChoice = 'B';
            this.mRecorderManager.printarray();
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.mCollide = this.mHero;
            this.mChoice = 'H';
        }
        if (engine.input.isKeyClicked(engine.input.keys.O))
        {
            this.mRecorderManager.start();
        }
        if (engine.input.isKeyClicked(engine.input.keys.P))
        {
            this.mRecorderManager.stop();
        }
        this.mMsg.setText(msg + this.mChoice);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return primitive types and null as is
    }

    let copy;
    if (Array.isArray(obj)) {
        copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
    } else if (obj instanceof Date) {
        copy = new Date(obj);
    } else if (obj instanceof RegExp) {
        copy = new RegExp(obj);
    } else {
        copy = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'function') {
                    // Skip functions
                    continue;
                }
                copy[key] = deepCopy(obj[key]);
            }
        }
    }
    return copy;
}