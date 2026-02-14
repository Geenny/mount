import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkComponent } from "./interface";
/**
 * Network component
 * Manages HTTP and WebSocket connections, request queues, caching, and retry logic
 */
declare class NetworkComponent extends StreamSubscribeComponent implements INetworkComponent {
    protected classes: any;
    protected createModel(): void;
    protected createView(): void;
    protected createController(): void;
}
export { NetworkComponent };
