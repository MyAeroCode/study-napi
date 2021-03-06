import { benchmark, BenchmarkTargetGroup } from "./benchmark";
import { addon, AddonParamType } from "./addon";

//
// define BenchmarkTarget.
const targets: BenchmarkTargetGroup = [
    {
        func: (arg) => addon.algoFibo(arg),
        name: "napi/algo-fibo-recursive"
    },
    {
        func: function({ N }) {
            const cache = new Map<number, number>();
            function fibo(n : number) : number{
                if(n === 0) return 0;
                if(n === 1) return 1;
                if(n === 2) return 1;
                if(!cache.has(n)) {
                    cache.set(n, fibo(n-1)+fibo(n-2));
                }
                return cache.get(n)!!;
            }

            return { 
                ans: fibo(N),
                statics: {}
            };
        },
        name: "node/algo-fibo-recursive"
    }
];

//
// define TestCase supplier.
function createParam(N: number): AddonParamType {
    if(N < 0 || 75 < N) {
        throw new Error(`N must be a positive integer less than or equal to 75.`);
    }

    return {
        N
    };
}

//
// start benchmark.
const strcnt = [25, 50, 75];
const repeat = 10000;
strcnt.forEach((n) => {
    const param = createParam(n);
    benchmark(targets, param, repeat, `N: ${n}`);
});
