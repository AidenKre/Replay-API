import engine from "./index.js";

class RecorderManager
{
    constructor(GameObjectSet)
    {
        this.mGameObjectSet = new engine.GameObjectSet();
        this.mRecording = [];
        this.mIsRecording = false;
        this.mMaxRecordingLength = -1;
        if(GameObjectSet != null) 
        {
        this.ListenTo(GameObjectSet);
        }
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
        let frameList = [];
        for(let i = 0; i < this.mGameObjectSet.size(); i++)
        {
            frameList.push(this.mGameObjectSet.getObjectAt(i).serialize());
        }
        this.mRecording.push(frameList);
        if(this.mMaxRecordingLength > 0)
        {
            if(this.mRecording.length > this.mMaxRecordingLength)
            {
                this.mRecording.shift();
            }
        }
        }
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
    }

    stop()
    {
        this.mIsRecording = false;
    }

    setMaxLengthInFrames(length)
    {
        this.mMaxRecordingLength = length;
    }

    setMaxLengthInTime(length)
    {
        this.setMaxLengthInFrames(length * 60);
    }

    getRecording()
    {
        return this.mRecording;
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

    printArray()
    {
        console.log(this.mRecording);
    }

}
export default RecorderManager;