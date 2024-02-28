import GameObject from "./game_object.js";

class GameObjectRecordable extends GameObject
{
    serialize()
    {
        return this.getXform().getPosition();
    }

    deserialize(data)
    {
        this.getXform().setPosition(data[0], data[1]);
    }
}

export default GameObjectRecordable;