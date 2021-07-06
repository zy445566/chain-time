# chain-time
chain time logger

# install
```sh
npm install chain-time
```

# example
```js
import {ChainTime,TiggerType} from 'chain-time'
const chainTimeStart2End = new ChainTime()
// start 2 end
chainTimeStart2End.start()
//doSomething
chainTimeStart2End.record('hello');
//doSomething
chainTimeStart2End.record('world');
//doSomething
chainTimeStart2End.end()
//doSomething
chainTimeStart2End.getTiggerData()
/**
 output:
 {
  "chain": [
    {
      "name": "start",
      "timestamp": 1625562923922
    },
    {
      "name": "hello",
      "timestamp": 1625562924924
    },
    {
      "name": "world",
      "timestamp": 1625562925929
    },
    {
      "name": "end",
      "timestamp": 1625562926933
    }
  ],
  "log": "start->1002ms->hello->1005ms->world->1004ms->end"
}
*/

const chainTimeStartByTimeOut = new ChainTime({
    tiggerFunction:()=>{
        console.log(`timeout${timeOut}:`+JSON.stringify(chainTime.getTiggerData(),null,2))
        /**
        output:
        {
            "chain": [
                {
                "name": "start",
                "timestamp": 1625562920911
                },
                {
                "name": "hello",
                "timestamp": 1625562921914
                }
            ],
            "log": "start->1003ms->hello"
            }
        */
    },
    tiggerType:TiggerType.Timeout,
    timeOut:1500
})
chainTimeStartByTimeOut.start()
await sleep(1000);
chainTimeStartByTimeOut.record('hello');
await sleep(1000);
chainTimeStartByTimeOut.record('world');
await sleep(1000);
chainTimeStartByTimeOut.end()

```
