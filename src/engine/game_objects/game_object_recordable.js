import GameObject from "./game_object.js";

class GameObjectRecordable extends GameObject
{
    serialize()
    {
        let x = this.getXform().getPosition()[0];
        let y = this.getXform().getPosition()[1];
        return [x,y];
    }

    deserialize(data)
    {
        this.getXform().setPosition(data[0], data[1]);
    }
}

export default GameObjectRecordable;