"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";

class DyePack extends engine.GameObjectRecordable {
    constructor(spriteTexture) {
        super(null);
        this.kRefWidth = 80;
        this.kRefHeight = 130;
        this.kDelta = 0.5;

        this.kLifeSpan = 500;
        this.kSpawnTime = performance.now();

        this.kSpriteTexture = spriteTexture;

        this.mReadyToDie = false;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
    }

    update() {
        if(performance.now() - this.kSpawnTime > this.kLifeSpan)
        {
            this.mReadyToDie = true;
        }
        this.getXform().incXPosBy(2);
    }

    ReadyToDie()
    {
        return this.mReadyToDie;
    }

    hit()
    {
        this.mReadyToDie = true;
    }
    
    spawn()
    {   

        return new DyePack(this.kSpriteTexture);
    }
    
    serialize()
    {
        return super.serialize()
    }

    deserialize(data)
    {
        super.deserialize(data);
    }
}

export default DyePack;