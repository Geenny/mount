import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { Storage } from "utils/storage/Storage";
import { NetworkConnectionRequest, NetworkStatsType } from "./types";
/**
 * Network component interface
 */
interface INetworkComponent extends IComponent {
}
/**
 * Network model interface
 */
interface INetworkModel extends IModel {
    requestQueues: Map<string, NetworkConnectionRequest[]>;
    activeRequests: Map<string, NetworkConnectionRequest>;
    caches: Map<string, Storage>;
    stats: NetworkStatsType;
}
/**
 * Network controller interface
 */
interface INetworkController extends IController {
}
/**
 * Network view interface
 */
interface INetworkView extends IView {
}
export type { INetworkComponent, INetworkModel, INetworkController, INetworkView };
