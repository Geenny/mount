import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorComponent, INetworkConnectorController, INetworkConnectorModel } from "./interface";
import { NetworkConnectorStatusEnum } from "../../enums";
import { RecipientTypeEnum, RecipientActionEnum } from "core/base/construction/recipient/enum";
import { RecipientData } from "core/base/construction/recipient/types";
import { NetworkConnectorModel } from "./mvc/NetworkConnectorModel";
import { NetworkConnectorController } from "./mvc/NetworkConnectorController";

/**
 * Abstract network connector component
 * Base class for HTTP and WebSocket connectors
 */
export abstract class NetworkConnectorComponent extends StreamSubscribeComponent implements INetworkConnectorComponent {
    
    #status: NetworkConnectorStatusEnum = NetworkConnectorStatusEnum.DISCONNECTED;

    protected controller?: INetworkConnectorController;
    protected model?: INetworkConnectorModel;
        
    protected classes = {
        Controller: NetworkConnectorController,
        Model: NetworkConnectorModel
    };


    //
    // GETTERS
    //

    get serverID(): string { return this.model?.id || "N/A"; }

    get isDefault(): boolean { return !!this.model?.isDefault; }

    /**
     * Check if connector is connected
     */
    get isConnected(): boolean {
        return this.status === NetworkConnectorStatusEnum.CONNECTED;
    }


    //
    // MESSAGE
    //

    onMessage(type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientData): void {
        super.onMessage( type, action, data );

        this.messageHandle( type, action, data );
    }

    protected messageHandle( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientData ): void {
        if ( type !== RecipientTypeEnum.DATA ) return;
        if ( action !== RecipientActionEnum.START ) return;

        const { event, data: request } = data.source;

        this.controller?.onEvent( event, request );
    }



    //
    // STATUS
    //
    
    /**
     * Get current connection status
     */
    get status(): NetworkConnectorStatusEnum {
        return this.model?.status || NetworkConnectorStatusEnum.DISCONNECTED;
    }

}
