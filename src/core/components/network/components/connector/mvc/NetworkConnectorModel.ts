import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorModel } from "../interface";
import { NetworkConnectorStatusEnum } from "core/components/network/enums";
import {
    NetworkConnectorServerType,
    NetworkConnectorConnectionType,
    NetworkConnectorHealthType,
    NetworkConnectorCacheType,
    NetworkConnectorAuthType,
    NetworkRequestStructType
} from "core/components/network/types";

export class NetworkConnectorModel extends BaseModel implements INetworkConnectorModel {

    constructor() {
        super();

        // @NetworkRequestStructType queue
        this.data.queue = [];

        // @NetworkRequestStructType queue for pending
        this.data.queuePending = [];
    }

    get id(): string { return this.data.id; }

    get isDefault(): boolean { return this.data.isDefault || false; }

    get status(): NetworkConnectorStatusEnum { return this.data.status || NetworkConnectorStatusEnum.DISCONNECTED; }
    set status( value: NetworkConnectorStatusEnum ) { this.data.status = value; }

    get server(): NetworkConnectorServerType { return this.data.server; }

    get connection(): NetworkConnectorConnectionType { return this.data.connection; }

    get health(): NetworkConnectorHealthType | undefined { return this.data.health; }

    get cache(): NetworkConnectorCacheType | undefined { return this.data.cache; }

    get auth(): NetworkConnectorAuthType | undefined { return this.data.auth; }

    get headers(): Record< string, string > | undefined { return this.data.headers; }

    get queue(): NetworkRequestStructType[] { return this.data.queue; }

    get queuePending(): NetworkRequestStructType[] { return this.data.queuePending; }

}