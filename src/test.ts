import assert from 'assert'
import {ChainTime,TiggerType} from './index'

function sleep(time) {
    return new Promise(reslove=>{
        setTimeout(reslove,time)
    })
}

const testUnit = {
    [Symbol('test.start-end')] : async function() {
        const chainTime = new ChainTime();
        chainTime.start()
        chainTime.end()
        assert.strictEqual(
            chainTime.getTiggerData().log,
            'start->0ms->end',
            'test.start-end error'
        )
    },
    [Symbol('test.start-sleep-end')] : async function() {
        const chainTime = new ChainTime();
        chainTime.start()
        await sleep(1000);
        chainTime.end()
        console.log('sleep1000:'+JSON.stringify(chainTime.getTiggerData(),null,2))
    },
    [Symbol('test.start-timeout')] : async function() {
        const timeOut = 1500;
        const chainTime = new ChainTime({
            tiggerFunction:()=>{
                console.log(`timeout${timeOut}:`+JSON.stringify(chainTime.getTiggerData(),null,2))
            },
            tiggerType:TiggerType.Timeout,
            timeOut
        });
        chainTime.start()
        await sleep(1000);
        chainTime.record('hello');
        await sleep(1000);
        chainTime.record('world');
        await sleep(1000);
        chainTime.end()
    },
    [Symbol('test.start-timeout-end')] : async function() {
        const timeOut = 5500;
        const chainTime = new ChainTime({
            tiggerFunction:()=>{
                console.log(`timeout${timeOut}-end:`+JSON.stringify(chainTime.getTiggerData(),null,2))
            },
            tiggerType:TiggerType.Timeout,
            timeOut
        });
        chainTime.start()
        console.log(`timeout${timeOut}-end:start`);
        await sleep(1000);
        chainTime.record('hello');
        await sleep(1000);
        chainTime.record('world');
        await sleep(1000);
        chainTime.end()
        console.log(`timeout${timeOut}-end:end`);
    },
    [Symbol('test.start-all-end')] : async function() {
        const chainTime = new ChainTime({
            tiggerFunction:()=>{
                console.log(`all:`+JSON.stringify(chainTime.getTiggerData(),null,2))
            },
        });
        chainTime.start()
        await sleep(1000);
        chainTime.record('hello');
        await sleep(1000);
        chainTime.record('world');
        await sleep(1000);
        chainTime.end()
    },
}


async function run(testUnitList) {
    for(let testUnitValue of testUnitList) {
        for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
            await testUnitValue[testFunc]();
        }
    }
}
(async function() {
    await run([testUnit]);
})();

