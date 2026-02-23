import { BaseController } from "core/base/construction/component/BaseController";
import { IView } from "core/base/construction/component/interface";
import { INetworkComponent, INetworkController, INetworkModel } from "../interface";
import { NETWORK_EVENT } from "core/constants";
import { NetworkConnectionRequest, NetworkResponseType, NetworkErrorType } from "../types";
import { NetworkRequestStatusEnum, NetworkRequestMethodEnum } from "../enums";
import { Storage } from "utils/storage/Storage";
import { output } from "utils/index";

/**
 * Network component controller
 * Manages request queues, caching, and routing to connector components
 */
export class Controller extends BaseController implements INetworkController {
    
    protected component: INetworkComponent;
    protected model: INetworkModel;
    
    constructor( component: INetworkComponent, model: INetworkModel, view: IView ) {
        super( component, model, view );
        
        this.component = component;
        this.model = model;
    }

}