import { IController, IModel, IView } from "core/base/construction/component/interface";

/**
 * Network connector request model interface
 */
interface INetworkConnectorRequestModel extends IModel {
    // status: NetworkConnectionStatusEnum;
    // abortControllers: Map< string, AbortController >;
}

/**
 * Network connector request controller interface
 */
interface INetworkConnectorRequestController extends IController {
    
}

/**
 * Network connector request view interface
 */
interface INetworkConnectorRequestView extends IView {
    
}

export type {
    INetworkConnectorRequestModel,
    INetworkConnectorRequestController,
    INetworkConnectorRequestView
};
