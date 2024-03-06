import GameObject from "./game_object.js";

class GameObjectRecordable extends GameObject
{
    serialize()
    {
        let xform = this.getXform();
        let xPos = xform.getPosition()[0];
        let yPos = xform.getPosition()[1];
        let r = xform.getRotationInRad();

        let xScale = xform.getSize()[0];
        let yScale = xform.getSize()[1];

        return {
            pos: [xPos,yPos],
            rot: r,
            scale: [xScale, yScale]
        }
    }

    deserialize(data)
    {
        let xform = this.getXform();
        xform.setPosition(data.pos[0], data.pos[1]);
        xform.setRotationInRad(data.rot);
        xform.setSize(data.scale[0], data.scale[1]);
        
    }
}

export default GameObjectRecordable;