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

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;

        this.mPortal = null;

        this.mRecorderManager = null;
        this.mPlaybackManager = null;
        this.mRecordingSet = null;

        this.mIsRecording = null;
        this.mIsPlaying = null;
        this.mIsRecordingPresent = null;
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
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        this.mHero = new Hero(this.kMinionSprite);
        this.mBrain = new Brain(this.kMinionSprite);


        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mCollide = this.mHero;

        this.mRecordingSet = new engine.GameObjectSet();
        this.mRecordingSet.addToSet(this.mHero);
        this.mRecordingSet.addToSet(this.mPortal);
        
        this.mRecorderManager = new engine.RecorderManager(this.mRecordingSet);
        this.mPlaybackManager = new engine.PlaybackManager(this.mRecorderManager);

        this.mIsRecording = false;
        this.mIsPlaying = false;
        this.mIsRecordingPresent = false;

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
        this.mPortal.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
        this.mPlaybackManager.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mPlaybackManager.update();
        this.mRecorderManager.update();
        this.mHero.update();

        this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
            engine.input.keys.Left, engine.input.keys.Right, engine.input.keys.Z);

            if (engine.input.isKeyClicked(engine.input.keys.O)) {
                this.mRecorderManager.start();
            }
            if (engine.input.isKeyClicked(engine.input.keys.P)) {
                this.mRecorderManager.stop();
            }
            if (engine.input.isKeyClicked(engine.input.keys.U)) {
                this.mPlaybackManager.play(true);
            }
            if (engine.input.isKeyClicked(engine.input.keys.I)) {
                this.mPlaybackManager.pause();
            }
            if (engine.input.isKeyClicked(engine.input.keys.J)) {
                this.mRecorderManager.saveToJSON();
            }
            if (engine.input.isKeyClicked(engine.input.keys.K)) {
                this.mPlaybackManager.loadFromJSON(this.kJSONRecording);
                this.mPlaybackManager.play(false);
            }
            if (engine.input.isKeyClicked(engine.input.keys.L))
            {
                this.mPlaybackManager.loop();
            }
            if (engine.input.isKeyPressed(engine.input.keys.One)) {
                this.mPlaybackSpeed += 0.05;
                this.mPlaybackManager.setSpeed(this.mPlaybackSpeed);
            }
            if (engine.input.isKeyPressed(engine.input.keys.Two)) {
                this.mPlaybackSpeed -= 0.05;
                this.mPlaybackManager.setSpeed(this.mPlaybackSpeed);
            }

        this.mMsg.setText("Player One Health: " + this.mHero.getHealth() + " Player Two Health: " + this.mPortal.getHealth());
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new ReplayGame();
    myGame.start();
}

export default ReplayGame;