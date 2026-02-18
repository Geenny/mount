import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorRequestModel } from "../interface";
import { NetworkConnectionStatus } from "../../../enums";
/**
 * Network connector request model
 */
export declare class Model extends BaseModel implements INetworkConnectorRequestModel {
    get status(): NetworkConnectionStatus;
    set status(value: NetworkConnectionStatus);
    get abortControllers(): Map<string, AbortController>;
    set abortControllers(value: Map<string, AbortController>);
}
