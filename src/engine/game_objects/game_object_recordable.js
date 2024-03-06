import GameObject from "./game_object.js";

class GameObjectRecordable extends GameObject
{
    serialize()
    {
        let x = this.getXform().getPosition()[0];
        let y = this.getXform().getPosition()[1];
        return {
            pos: [x,y]
        }
    }

    deserialize(data)
    {
        this.getXform().setPosition(data.pos[0], data.pos[1]);
    }
}

export default GameObjectRecordable;