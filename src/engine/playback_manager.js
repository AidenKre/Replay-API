import engine from "./index.js";
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
        this.mJSONRecording = null;
    }

    play(bool)
    {
        this.mIsPlaying = true;
        this.mGameObjectSet = this.mRecorderManager.getGameObjectSet();
        if(bool)
        {
            this.mRecording = this.mRecorderManager.getRecording();
        } else
        {
            this.mRecording = this.mJSONRecording;
        }
        this.mLastElement = this.mRecording.length;
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

    loadFromJSON(filepath)
    {
        this.mJSONRecording = engine.json.get(filepath);
    }

}

export default PlaybackManager;