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
        this.kGrassSprite = "assets/grass.png";
        this.kLavaSprite = "assets/lava.png";
        this.kCloudSprite = "assets/cloud.png";


        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;

        this.mPortal = null;
/*
        this.mPortalHit = null;
        this.mHeroHit = null;

        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mCollide = null;

        this.mChoice = 'H';
*/
        // recorder stuff
        this.mRecorderManager = null;
        this.mPlaybackManager = null;
        this.mRecordingSet = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kGrassSprite);
        engine.texture.load(this.kLavaSprite);
        engine.texture.load(this.kCloudSprite);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kGrassSprite);
        engine.texture.unload(this.kLavaSprite);
        engine.texture.unload(this.kCloudSprite);
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
        this.mCamera.setBackgroundColor([0.8, 0.8, 1, 1]);
        // sets the background to gray
        this.mPlaybackCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
        // sets the background to darker grey

        this.mBrain = new Brain(this.kMinionSprite);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.kMinionSprite);

        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mGrassOne = new TextureObject(this.kGrassSprite, 20, -15, 45, 30);
        this.mGrassTwo = new TextureObject(this.kGrassSprite, 80, -5, 45, 30);
        this.mLavaOne = new TextureObject(this.kLavaSprite, 50, -30, 50, 50);
        this.mCloudOne = new TextureObject(this.kCloudSprite, 20, 60, 80, 80);
        this.mCloudTwo = new TextureObject(this.kCloudSprite, 70, 70, 50, 50);
/*
        this.mPortalHit = new DyePack(this.kMinionSprite);
        this.mPortalHit.setVisibility(false);
        this.mHeroHit = new DyePack(this.kMinionSprite);
        this.mHeroHit.setVisibility(false);

        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);
*/
        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(15, 85);
        this.mMsg.setTextHeight(2);

        //this.mCollide = this.mHero;

        this.mRecordingSet = new engine.GameObjectSet();
        this.mRecordingSet.addToSet(this.mHero);
        this.mRecordingSet.addToSet(this.mPortal);
        //this.mRecordingSet.addToSet(this.mBrain);
        
        this.mRecorderManager = new engine.RecorderManager(this.mRecordingSet);
        this.mRecorderManager.init();
        this.mPlaybackManager = new engine.PlaybackManager(this.mRecorderManager);

        this.isRecording = false;
        this.isPlaying = false;
        this.isRecordingPresent = false;
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Draw everything
        this.mCloudOne.draw(this.mCamera);
        this.mCloudTwo.draw(this.mCamera);
        this.mLavaOne.draw(this.mCamera);
        this.mGrassOne.draw(this.mCamera);
        this.mGrassTwo.draw(this.mCamera);

        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);
        this.mPortal.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);
        this.mPlaybackManager.draw(this.mCamera);

        
    }

    update() {
        let msg = "Recording: " + this.isRecording + " Playing: " + this.isPlaying + " Recording present: " + this.isRecordingPresent;
        this.mPlaybackManager.update();
        this.mRecorderManager.update();
        this.mHero.update();

        this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
            engine.input.keys.Left, engine.input.keys.Right, engine.input.keys.Z);

        let h = [];

        if (engine.input.isKeyClicked(engine.input.keys.O))
        {
            this.isRecording = true;
            this.mRecorderManager.start();
        }
        if (engine.input.isKeyClicked(engine.input.keys.P))
        {
            this.isRecording = false;
            this.isRecordingPresent = true;
            this.mRecorderManager.stop();
        }
        if (engine.input.isKeyClicked(engine.input.keys.U))
        {
            this.isPlaying = true;
            this.mPlaybackManager.play();
        }
        if (engine.input.isKeyClicked(engine.input.keys.I))
        {
            //this.isPlaying = false;
            //this.mRecorderManager.stop();
        }
        this.mMsg.setText("Recording: " + this.isRecording + " Playing: " + this.isPlaying + " Recording present: " + this.isRecordingPresent);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}