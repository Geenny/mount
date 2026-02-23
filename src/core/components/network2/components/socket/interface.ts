import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
import { NetworkConnectionStatusEnum } from "../../enums";

/**
 * Network connector socket component interface
 */
interface INetworkConnectorSocketComponent extends IComponent {

}

/**
 * Network connector socket model interface
 */
interface INetworkConnectorSocketModel extends IModel {

}

/**
 * Network connector socket controller interface
 */
interface INetworkConnectorSocketController extends IController {
    
}

/**
 * Network connector socket view interface
 */
interface INetworkConnectorSocketView extends IView {
    
}

export type {
    INetworkConnectorSocketComponent,
    INetworkConnectorSocketModel,
    INetworkConnectorSocketController,
    INetworkConnectorSocketView
};
