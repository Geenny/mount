import { INetworkConnectorController, INetworkConnectorModel } from "../connector/interface";

/**
 * Network connector request model interface
 */
interface INetworkConnectorRequestModel extends INetworkConnectorModel {
    
}

/**
 * Network connector request controller interface
 */
interface INetworkConnectorRequestController extends INetworkConnectorController {
    
}

export type {
    INetworkConnectorRequestModel,
    INetworkConnectorRequestController
};
