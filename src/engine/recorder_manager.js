import engine from "./index.js";

class RecorderManager
{
    constructor(GameObjectSet)
    {
        this.mGameObjectSet = new engine.GameObjectSet();
        this.mRecording = [];
        this.mIsRecording = false;
        this.mMaxRecordingLength = -1;
        if(object != null) 
        {
        this.ListenTo(GameObjectSet);
        }

        this.mMasterList = [];
        this.mDynamicSet = [];
        this.mDynamicRecording = [];
    }

    ListenTo(object)
    {
        if(object instanceof engine.GameObject)
        {
            this.mGameObjectSet.addToSet(object);
            console.log("Listening to a Game Object");
        }
        else if(object instanceof engine.GameObjectSet)
        {
            for(let i = 0; i < object.size(); i++)
            {
                this.mGameObjectSet.addToSet(object.getObjectAt(i));
            }
            console.log("Listening to a GameObjectSet of size " + object.size());
        } else
        {
            console.log("The Recorder Manager can only listen to GameObjects or GameObjectSets");
        }
    }

    DynamicListenTo(Master, GameObjectSet)
    {
        this.mMasterList.push(Master);
        this.mDynamicSet.push(GameObjectSet);
    }

/*    init()
    {
        for(let i = 0; i < this.mGameObjectSet.size(); i++)
        {
            this.mRecording[i] = [];
        }   
    } */

    update()
    {
        if(this.mIsRecording) 
        {
            this.staticUpdate();
            this.dynamicUpdate();
            if(this.mMaxRecordingLength > 0)
        {
            if(this.mRecording.length > this.mMaxRecordingLength)
            {
                this.mRecording.shift();
                this.mDynamicRecording.shift();
            }
        }
        }
    }

    staticUpdate()
    {
        let frameList = [];
        for(let i = 0; i < this.mGameObjectSet.size(); i++)
        {
            frameList.push(this.mGameObjectSet.getObjectAt(i).serialize());
        }
        this.mRecording.push(frameList);
    }

    dynamicUpdate()
    {
        let wholeList = []
        for(let i = 0; i < this.mMasterList.length; i++)
        {
            let frameList = [];
            for(let j = 0; j < this.mDynamicSet[i].size(); j++)
            {
                frameList.push(this.mDynamicSet[i].getObjectAt(j).serialize());
            }
        wholeList.push(frameList);
        }
        this.mDynamicRecording.push(wholeList);
    }

    start()
    {
        if(this.mIsRecording)
        {
            console.log("Cannot start a new recording while recording.");
            return;
        }
        if (this.mGameObjectSet.size() == 0)
        {
            console.log("Cannot record with no GameObjects being Listened to");
            return;
        }
        this.mIsRecording = true;
        this.mRecording = [];
        this.mDynamicRecording = [];
    }

    stop()
    {
        this.mIsRecording = false;
    }

    setMaxLengthInFrames(length)
    {
        this.mMaxRecordingLength = length;
    }

    setMaxLengthInSeconds(length)
    {
        this.setMaxLengthInFrames(length * 60);
    }

    getRecording()
    {
        return this.mRecording;
    }

    getDynamicRecording()
    {
        return this.mDynamicRecording;
    }

    saveToJSON()
    {
        if(this.mRecording.length == 0)
        {
            console.log("Must have a recording to save to JSON.");
            return;
        }
        //https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        download(JSON.stringify(this.mRecording), "json.txt", 'text/plain');
    }
    
    getLength()
    {
        return this.mRecording.length;
    }

    getGameObjectSet()
    {
        return this.mGameObjectSet;
    }

    getMasterDynamicSet()
    {
        return {
            MasterList: this.mMasterList,
            DynamicSet: this.mDynamicSet
        }
    }

    printArray()
    {
        console.log(this.mRecording);
        console.log(this.mDynamicRecording);
    }

}
export default RecorderManager;