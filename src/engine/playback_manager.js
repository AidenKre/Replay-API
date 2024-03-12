import engine from "./index.js";
class PlaybackManager {
    constructor(RecorderManager) {
        this.mRecorderManager = RecorderManager;
        this.mIsPlaying = false;
        this.mIndex = 0;
        this.mLastElement = 0;
        this.mFirstIndex = 0;
        this.mGameObjectSet = null;
        this.mRecording = null;
        this.mJSONRecording = null;
        this.mPlaybackSpeed = 1.0;
        this.mPauseModifier = 1.0;
        this.mIsReverse;
        this.mIsLooping = false;
        this.mMasterList = [];
        this.mDynamicSet = [];
        this.mDynamicRecording = [];
        this.mTempDynamicList = new engine.GameObjectSet();
    }

    setSpeed(speed) {
        this.mPlaybackSpeed = speed;
        if (this.mPlaybackSpeed > 0) {
            this.mIsReverse = false;
        } else {
            this.mIsReverse = true;
        }
    }

    incSpeed(speed) {
        this.setSpeed(this.mPlaybackSpeed + speed);
    }

    getSpeed() {
        return this.mPlaybackSpeed;
    }

    getLooping() {
        return this.mIsLooping;
    }

    play(dontUseJSON) {
        //check if 0
        if(this.mPauseModifier == 0)
        {
            this.mPauseModifier = 1;
            return;
        }
        //check if reversing
        if (this.mPlaybackSpeed > 0) {
            this.mIndex = 0;
        } else {
            this.mIndex = this.mLastElement - 1;
        }
        this.mGameObjectSet = this.mRecorderManager.getGameObjectSet();
        //check if using JSON
        if (dontUseJSON) {
            this.mRecording = this.mRecorderManager.getRecording();
            this.mDynamicRecording = this.mRecorderManager.getDynamicRecording();
            let temp = this.mRecorderManager.getMasterDynamicSet()
            this.mMasterList = temp.MasterList;
            this.mDynamicSet = temp.DynamicSet;
        } else {
            this.mRecording = this.mJSONRecording;
        }
        this.mLastElement = this.mRecording.length;
        this.mIsPlaying = true;
    }

    pause()
    {
        this.mPauseModifier = 0;
    }

    loop()
    {
        this.mIsLooping = !this.mIsLooping;
    }

    update() {
        if (this.mIsPlaying) {
            if (this.isWithinBounds()) {
                let index = Math.floor(this.mIndex);
                this.dynamicUpdate(index);
                for (let i = 0; i < this.mRecording[index].length; i++) {
                    this.mGameObjectSet.getObjectAt(i).deserialize(this.mRecording[index][i]);
                }
                this.mIndex += this.mPlaybackSpeed * this.mPauseModifier;
            } else {
                if(this.mIsLooping)
                {
                    if(this.mIndex <= 0)
                    {
                        this.mIndex = this.mLastElement - 1;
                    } else
                    {
                        this.mIndex = 0;
                    }
                    return;
                }
                this.mIsPlaying = false;
            }
        }
    }

    dynamicUpdate(index)
    {
        for(let i = 0; i < this.mMasterList.length; i++)
        {
            for(let j = 0; j < this.mDynamicRecording[index][i].length; j++)
            {
                let temp = this.mMasterList[i].spawn();
                temp.deserialize(this.mDynamicRecording[index][i][j]);
                this.mTempDynamicList.addToSet(temp);
            }
        }
    }

    IsPlaying()
    {
        return this.mIsPlaying;
    }

    isWithinBounds() {
        if (this.mIsReverse) {
            return this.mIndex > 0;
        } else {
            return this.mIndex < this.mLastElement;
        }
    }

    draw(Camera) {
        if (this.mIsPlaying) 
        {
            this.mGameObjectSet.draw(Camera);
            this.mTempDynamicList.draw(Camera);
            this.mTempDynamicList = new engine.GameObjectSet();
        }
    }

    loadFromJSON(filepath) {
        this.mJSONRecording = engine.json.get(filepath);
    }

}

export default PlaybackManager;