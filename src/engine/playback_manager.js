class PlaybackManager
{
    constructor(RecorderManager)
    {
        this.mRecorderManager = RecorderManager;
        this.mIsPlaying = false;
        this.mIndex = 0;
        this.mLastElement = 0;
        this.mGameObjectSet = null;
        this.mRecording = null;
    }

    play()
    {
        this.mIsPlaying = true;
        this.mLastElement = this.mRecorderManager.getLength();
        this.mGameObjectSet = this.mRecorderManager.getGameObjectSet();
        this.mRecording = this.mRecorderManager.getRecording();
        this.mRecorderManager.printArray();
        this.mIndex = 0;
    }

    update()
    {
        if(this.mIsPlaying)
        {
            if(this.mIndex < this.mLastElement)
            {
                for(let i = 0; i < this.mRecording[this.mIndex].length; i++)
                {
                    this.mGameObjectSet.getObjectAt(i).deserialize(this.mRecording[this.mIndex][i]);
                }
                this.mIndex++;
            } else
            {
                this.mIsPlaying = false;
            }
        }
    }

    draw(Camera)
    {
        if(this.mIsPlaying) this.mGameObjectSet.draw(Camera);
    }


}

export default PlaybackManager;