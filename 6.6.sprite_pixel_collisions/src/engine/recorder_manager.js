class RecorderManager
{
    constructor(GameObject)
    {
        this.mGameObject = GameObject;
        this.mRecording = [];
        this.mIsRecording = false;
    }

    update()
    {
        if(this.mIsRecording) this.mRecording.push(this.mGameObject.serialize());
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

    printarray()
    {
        console.log(this.mRecording);
    }

}
export default RecorderManager;