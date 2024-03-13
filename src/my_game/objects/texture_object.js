"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class TextureObject extends engine.GameObjectRecordable {
    constructor(texture, x, y, w, h) {
        super(null);
        this.kDelta = 0.2;
        this.kRDelta = 0.1; // radian

        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(x, y);
        this.mRenderComponent.getXform().setSize(w, h);

        this.mHealth = 4;
    }

    update(up, down, left, right, rot) {
        let xform = this.getXform();
        if (engine.input.isKeyPressed(up)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(down)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(left)) {
            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(right)) {
            xform.incXPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(rot)) {
            xform.incRotationByRad(this.kRDelta);
        }
    }

    
    hit() 
    {
        this.mHealth--;
        return this.mHealth < 1;
    }

    getHealth()
    {
        return this.mHealth;
    }

    serialize()
    {
        return {
            xform: super.serialize(),
            health: this.mHealth
        }
    }

    deserialize(data)
    {
        super.deserialize(data.xform);
        this.mHealth = data.health;
    }
}

export default TextureObject;