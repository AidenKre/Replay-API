"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";

class ReplayGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kSimpsonSprite = "assets/simpson.png";
        this.kHomerSprite = "assets/Homar.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mPortal = null;

        this.mDyePackSet;

        this.mRecorderManager = null;
        this.mPlaybackManager = null;
        this.mRecordingSet = null;

        this.mReadyToReset = false;
        this.mWasPlaying = false;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kSimpsonSprite);
        engine.texture.load(this.kHomerSprite);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kSimpsonSprite);
        engine.texture.unload(this.kHomerSprite);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 400, 400]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        this.mHero = new Hero(this.kHomerSprite);
        this.mBrain = new Brain(this.kMinionSprite);
        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);
        this.mSimpsonBackground = new TextureObject(this.kSimpsonSprite, 50, 37.5, 100, 100);

        this.mMasterDyePack = new DyePack(this.kMinionSprite);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(11, -5);
        this.mMsg.setTextHeight(3);

        this.mCollide = this.mHero;

        this.mDyePackSet = new engine.GameObjectSet();

        this.mRecordingSet = new engine.GameObjectSet();
        this.mRecordingSet.addToSet(this.mHero);
        this.mRecordingSet.addToSet(this.mPortal);

        this.mRecorderManager = new engine.RecorderManager(this.mRecordingSet);
        this.mPlaybackManager = new engine.PlaybackManager(this.mRecorderManager);

        this.mRecorderManager.setMaxLengthInSeconds(4);
        this.mRecorderManager.start();

        this.mRecorderManager.DynamicListenTo(this.mMasterDyePack, this.mDyePackSet);



    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  B.5: Draw background
        this.mSimpsonBackground.draw(this.mCamera);

        // Step  C: Draw everything
        this.mHero.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
        this.mDyePackSet.draw(this.mCamera);

        this.mPlaybackManager.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {

        this.mPlaybackManager.update();
        this.mRecorderManager.update();
        this.DyePackCleanUp();
        this.ResetManagement();
        if (!this.mPlaybackManager.IsPlaying()) {
            this.mHero.update();
            this.mDyePackSet.update();
            this.DyePackCollion();
            this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
                engine.input.keys.Left, engine.input.keys.Right, engine.input.keys.Z);

            if (engine.input.isKeyClicked(engine.input.keys.Space)) {
                let temp = this.mMasterDyePack.spawn();
                let pos = this.mHero.getXform().getPosition();
                temp.getXform().setPosition(pos[0], pos[1]);
                this.mDyePackSet.addToSet(temp);
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            this.mPlaybackManager.loop();
        }

        this.mMsg.setText("Player One Health: " + this.mHero.getHealth() + "    Player Two Health: " + this.mPortal.getHealth());
    }

    DyePackCleanUp() {
        for (let i = 0; i < this.mDyePackSet.size(); i++) {
            let temp = this.mDyePackSet.getObjectAt(i);
            if (temp.ReadyToDie()) {
                this.mDyePackSet.removeFromSet(temp);
            }

        }
    }

    DyePackCollion() {
        for (let i = 0; i < this.mDyePackSet.size(); i++) {
            let pos = [0, 0];
            let temp = this.mDyePackSet.getObjectAt(i);
            if (temp.pixelTouches(this.mPortal, pos)) {
                temp.hit();
                this.mPortalDead = this.mPortal.hit();
                if (this.mPortalDead) this.KillCam();
            }

        }
    }

    KillCam() {
        this.mRecorderManager.stop();
        this.mPlaybackManager.play(true);

    }

    ResetManagement() {
        //voodoo magic
        if (this.mPlaybackManager.IsPlaying()) {
            this.mWasPlaying = true;
        }
        if (this.mWasPlaying) {
            if (!this.mPlaybackManager.IsPlaying()) {
                this.mReadyToReset = true;
            }
        }
    }

    IsReadyToReset() {
        return this.mReadyToReset;
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new ReplayGame();
    myGame.start();
}

export default ReplayGame;