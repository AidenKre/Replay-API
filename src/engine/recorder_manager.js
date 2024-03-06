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
        if(this.mIsRecording)
        {
            console.log("Cannot start a new recording while recording.");
            return;
        }
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

    saveToJSON()
    {
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