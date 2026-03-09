import { IController, IModel, IView } from "core/base/construction/component/interface";
import { INetworkConnectorController, INetworkConnectorModel } from "../connector/interface";

/**
 * Network connector socket model interface
 */
interface INetworkConnectorSocketModel extends INetworkConnectorModel {

    socket?: WebSocket;

}

/**
 * Network connector socket controller interface
 */
interface INetworkConnectorSocketController extends INetworkConnectorController {
    
}

export type {
    INetworkConnectorSocketModel,
    INetworkConnectorSocketController
};
