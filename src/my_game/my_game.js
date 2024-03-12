"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import ReplayGame from "./my_replay_game.js";
import TutorialGame from "./my_tutorial_game.js";

class MyGame extends engine.Scene {
    constructor() 
    {
        super();
        this.mReplayGame = new ReplayGame();
        this.mTutorialGame = new TutorialGame();
        this.mIsUsingFirstGame = true;
    }

    load() {
       this.mReplayGame.load();
       this.mTutorialGame.load();
    }

    unload() {
        this.mReplayGame.unload();
        this.mTutorialGame.unload();
    }

    init() {
        this.mReplayGame.init();
        this.mTutorialGame.init();
    }

    draw() {
        if(this.mIsUsingFirstGame) 
        {
            this.mReplayGame.draw();
        } else
        {
            this.mTutorialGame.draw();
        }
    }

    update() {
        if(engine.input.isKeyClicked(engine.input.keys.N))
        {
            this.mIsUsingFirstGame = !this.mIsUsingFirstGame;
        }
        if(this.mIsUsingFirstGame) 
        {
            this.mReplayGame.update();
        } else
        {
            this.mTutorialGame.update();
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}