import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { Storage } from "utils/storage/Storage";
import { NetworkConnectorComponent } from "./components/connector/NetworkConnectorComponent";
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
    connectors: Map<string, NetworkConnectorComponent>;
    requestQueues: Map<string, NetworkConnectionRequest[]>;
    activeRequests: Map<string, NetworkConnectionRequest>;
    caches: Map<string, Storage>;
    stats: NetworkStatsType;
    getConnector(serverId: string): NetworkConnectorComponent | undefined;
    getQueue(serverId: string): NetworkConnectionRequest[];
    getCache(serverId: string): Storage | undefined;
    updateStats(): void;
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
