export enum TiggerType{
    Start,
    End,
    Timeout
}
enum RecordType{
    Start='start',
    End='end',
}
export class ChainTime {
    tiggerType:TiggerType;
    timeOut:number;
    tiggerFunction:Function;
    chainTimeDataList:Array<{name:string,timestamp:number}>
    constructor(config:{tiggerType?:TiggerType,timeOut?:number,tiggerFunction?:Function}={}) {
        this.tiggerType = config.tiggerType || TiggerType.End;
        this.timeOut = config.timeOut || 3000;
        this.tiggerFunction = config.tiggerFunction || (()=>{});
        this.chainTimeDataList = [];
    }

    record(name:string) {
        this.chainTimeDataList.push({
            name,
            timestamp:Date.now()
        })
    }

    start() {
        this.record(RecordType.Start);
        this.tigger(RecordType.Start);
    }

    end() {
        this.record(RecordType.End);
        this.tigger(RecordType.End);
    }
    getTiggerData() {
        return {
            chain:this.chainTimeDataList,
            log:this.logger()
        }
    }
    tigger(name:RecordType) {
        const runTigger = ()=>{
            this.tiggerFunction(this.getTiggerData());
        }
        if(name===RecordType.Start) {
            if(this.tiggerType===TiggerType.Timeout && this.timeOut) {
                const timeOutKey = setTimeout(()=>{
                    if(this.chainTimeDataList[this.chainTimeDataList.length-1].name!==RecordType.End)
                    {
                        runTigger();
                    }
                    clearTimeout(timeOutKey)
                },this.timeOut)
            }
            if(this.tiggerType===TiggerType.Start) {
                runTigger();
            }
        }
        if(name===RecordType.End) {
            if(this.tiggerType===TiggerType.End) {
                runTigger();
            }
        }
    }

    logger() {
        let chainTimeNow = 0;
        return this.chainTimeDataList.map(chainTimeData=>{
            const chainTime = chainTimeData.timestamp-chainTimeNow;
            chainTimeNow = chainTimeData.timestamp;
            if(chainTimeData.name===RecordType.Start) {
                return  `${chainTimeData.name}`
            }
            return `${chainTime}ms->${chainTimeData.name}`
        }).join('->')
    }
}

export default ChainTime;