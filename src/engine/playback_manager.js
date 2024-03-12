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
        } else {
            this.mRecording = this.mJSONRecording;
        }
        this.mLastElement = this.mRecording.length;
        this.mIsPlaying = true;
        this.mRecorderManager.printArray();
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
        if (this.mIsPlaying) this.mGameObjectSet.draw(Camera);
    }

    loadFromJSON(filepath) {
        this.mJSONRecording = engine.json.get(filepath);
    }

}

export default PlaybackManager;