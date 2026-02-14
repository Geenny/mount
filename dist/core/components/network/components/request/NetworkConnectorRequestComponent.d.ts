import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
/**
 * HTTP/HTTPS connector component using fetch API
 */
declare class NetworkConnectorRequestComponent extends NetworkConnectorComponent {
    private abortControllers;
    constructor(serverConfig: NetworkServerConfig);
    /**
     * Connect to server (perform health check if configured)
     */
    connect(): Promise<void>;
    /**
     * Disconnect from server (cancel all pending requests)
     */
    disconnect(): Promise<void>;
    /**
     * Send HTTP request
     */
    send(request: NetworkRequestType): Promise<NetworkResponseType>;
    /**
     * Build request URL with endpoint and salt
     */
    private buildUrl;
    /**
     * Build request headers
     */
    private buildHeaders;
    /**
     * Build request body
     */
    private buildBody;
    /**
     * Parse response based on content type
     */
    private parseResponse;
    /**
     * Parse response headers to object
     */
    private parseHeaders;
    /**
     * Generate unique request ID
     */
    private generateRequestId;
}
export { NetworkConnectorRequestComponent };
