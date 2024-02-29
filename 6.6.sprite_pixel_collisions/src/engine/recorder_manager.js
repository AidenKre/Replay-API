class RecorderManager
{
    constructor(GameObjectSet)
    {
        this.mGameObjectSet = GameObjectSet;
        this.mRecording = [];
        this.mIsRecording = false;
    }

    init()
    {
        for(let i = 0; i < this.mGameObjectSet.size(); i++)
        {
            this.mRecording[i] = [];
        }   
    }

    update()
    {
        if(this.mIsRecording) 
        {
        let frameList = [];
        for(let i = 0; i < this.mGameObjectSet.size(); i++)
        {
            frameList.push(this.mGameObjectSet.getObjectAt(i).serialize());
        }
        this.mRecording.push(frameList);
        }
    }

    start()
    {
        this.mIsRecording = true;
        this.mRecording = [];
    }

    stop()
    {
        this.mIsRecording = false;
    }

    getRecording()
    {
        return this.mRecording;
    }
    
    getLength()
    {
        return this.mRecording.length;
    }

    getGameObjectSet()
    {
        return this.mGameObjectSet;
    }

    printArray()
    {
        console.log(this.mRecording);
    }

}
export default RecorderManager;