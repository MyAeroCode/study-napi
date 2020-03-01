import { BenchmarkTargetFunctionReturn } from "./benchmark";

/**
 * for require alias.
 */
require("module-alias/register");

/**
 * define paramType of function.
 */
export type AddonParamType = {
    N: number;
};

/**
 * declare Addon Module Interface.
 */
interface AddonModuleInterface {
    sum: (param: AddonParamType) => BenchmarkTargetFunctionReturn<number>;
}

/**
 * export addon.
 */
export const addon: AddonModuleInterface = require("@addon/my-addon.node");
