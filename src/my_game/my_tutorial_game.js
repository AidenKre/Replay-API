"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import TextureObject from "./objects/texture_object.js";

class TutorialGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kGrassSprite = "assets/grass.png";
        this.kLavaSprite = "assets/lava.png";
        this.kCloudSprite = "assets/cloud.png";
        this.kJSONRecording = "src/my_game/recordings/cutscene.json";
        this.kHomerSprite = "assets/Homar.png";


        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;

        this.mPortal = null;

        // recorder stuff
        this.mRecorderManager = null;
        this.mPlaybackManager = null;
        this.mRecordingSet = null;

        this.mPlaybackSpeed = null;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kGrassSprite);
        engine.texture.load(this.kLavaSprite);
        engine.texture.load(this.kCloudSprite);
        engine.json.load(this.kJSONRecording);
        engine.texture.load(this.kHomerSprite);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kGrassSprite);
        engine.texture.unload(this.kLavaSprite);
        engine.texture.unload(this.kCloudSprite);
        engine.json.unload(this.kJSONRecording);
        engine.texture.unload(this.kHomerSprite);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 400, 400]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 1, 1]);
        // sets the background to gray

        this.mBrain = new Brain(this.kMinionSprite);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.kHomerSprite);

        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mHero.getXform().setPosition(11.9, 5.6);
        this.mHero.getXform().setSize(9, 12);
        this.mPortal.getXform().setPosition(35.3, 5.4);

        this.mGrassOne = new TextureObject(this.kGrassSprite, 20, -15, 45, 30);
        this.mGrassTwo = new TextureObject(this.kGrassSprite, 80, -5, 45, 30);
        this.mLavaOne = new TextureObject(this.kLavaSprite, 50, -30, 50, 50);
        this.mCloudOne = new TextureObject(this.kCloudSprite, 20, 60, 80, 80);
        this.mCloudTwo = new TextureObject(this.kCloudSprite, 70, 70, 50, 50);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(12, 85);
        this.mMsg.setTextHeight(3);

        this.mMsg2 = new engine.FontRenderable("Status Message");
        this.mMsg2.setColor([0, 0, 0, 1]);
        this.mMsg2.getXform().setPosition(5, 80);
        this.mMsg2.setTextHeight(3);

        //this.mCollide = this.mHero;

        this.mRecordingSet = new engine.GameObjectSet();
        this.mRecordingSet.addToSet(this.mHero);
        this.mRecordingSet.addToSet(this.mPortal);
        //this.mRecordingSet.addToSet(this.mBrain);

        this.mRecorderManager = new engine.RecorderManager(this.mRecordingSet);
        this.mPlaybackManager = new engine.PlaybackManager(this.mRecorderManager);

        this.isRecording = false;
        this.isPlaying = false;
        this.isRecordingPresent = false;
        this.mPlaybackSpeed = 1.0;
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
        this.mMsg2.draw(this.mCamera);
        this.mPlaybackManager.draw(this.mCamera);


    }

    update() {
        let msg = "Recording: " + this.isRecording + "    Recording present: " + this.isRecordingPresent;
        let msg2 = "Playing: " + this.isPlaying + "  Playback speed: " + this.mPlaybackManager.getSpeed().toFixed(2) + "  Looping: " + this.mPlaybackManager.getLooping();
        this.mPlaybackManager.update();
        this.mRecorderManager.update();
        this.mHero.update();

        if (engine.input.isKeyClicked(engine.input.keys.O)) {
            this.mRecorderManager.start();
            this.isRecording = true;
        }
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mRecorderManager.stop();
            this.isRecording = false;
            this.isRecordingPresent = true;
        }
        if (engine.input.isKeyClicked(engine.input.keys.U)) {
            this.mPlaybackManager.play(true);
            this.isPlaying = true;
        }
        if (engine.input.isKeyClicked(engine.input.keys.I)) {
            this.mPlaybackManager.pause();
            this.isPlaying = false;
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
            this.mPlaybackManager.incSpeed(0.05);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Two)) {
           this.mPlaybackManager.incSpeed(-0.05);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Three)){
           this.mPlaybackManager.setSpeed(1);
        }

        this.mMsg.setText(msg);
        this.mMsg2.setText(msg2);
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new TutorialGame();
    myGame.start();
}

export default TutorialGame;