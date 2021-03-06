import { AddonParamType } from "./addon";

/**
 * Returns the execution time of a given function.
 */
export function getExecutionTime(func: (arg: void) => void): number {
    const srt = process.hrtime();
    func();
    const dif = process.hrtime(srt);
    return dif[0] * 1e9 + dif[1];
}

/**
 * Return type of benchmark target function.
 */
export interface BenchmarkTargetFunctionReturn {
    ans: any;
    statics: {
        [key: string]: number;
    };
}

/**
 * Information of the function to perform the benchmark.
 */
export class BenchmarkTarget {
    func: (arg: AddonParamType) => BenchmarkTargetFunctionReturn;
    name: string;

    constructor(func: (arg: AddonParamType) => BenchmarkTargetFunctionReturn, name: string) {
        this.func = func;
        this.name = name;
    }
}

/**
 * Define group of benchmark target.
 */
export type BenchmarkTargetGroup = BenchmarkTarget[];

/**
 * Measure the execution time of the given benchmark targets.
 */
export function benchmark<T>(targets: BenchmarkTarget[], arg: AddonParamType, repeat: number, tag?: string): void {
    //
    // display tag.
    console.log("----------------------------------");
    console.group(tag ? `* ${tag}` : "");

    //
    // start benchmark.
    for (const target of targets) {
        let statics: any = {};
        let totalExecutionTime: number = 0;
        for (let i = 0; i < repeat; i++) {
            //
            // prints the progress.
            process.stdout.write(`Test in progress... ${i} / ${repeat}                    \r`);

            //
            // execute function then save into "thisTestOutput".
            let thisTestOutput: BenchmarkTargetFunctionReturn | undefined;
            totalExecutionTime += getExecutionTime(() => {
                thisTestOutput = target.func(arg);
            });

            //
            // get internal time information.
            for (const key in thisTestOutput?.statics) {
                if (statics[key] === undefined) statics[key] = 0;
                statics[key] += thisTestOutput?.statics[key];
            }

            if (repeat === 1) console.log(thisTestOutput?.ans + "                  ");
        }

        //
        // Print result.
        let etc = totalExecutionTime / repeat / 1e3;
        let subCnt = 0;
        console.log(`[${target.name}] ${etc} us`);
        console.group();
        for (const key in statics) {
            const thisPhaseExecutionTime = statics[key] / repeat / 1e3;
            etc -= thisPhaseExecutionTime;
            subCnt++;
            console.log(`> ${key} : ${thisPhaseExecutionTime} us`);
        }
        if (subCnt !== 0) {
            console.log(`> etc : ${etc} us`);
        }
        console.groupEnd();
    }
    console.groupEnd();
}
