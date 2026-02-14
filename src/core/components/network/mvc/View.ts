import { BaseView } from "core/base/construction/component/BaseView";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";

/**
 * Network component view
 */
export class View extends BaseView implements INetworkView {
    
    protected component: INetworkComponent;
    protected controller: INetworkController;
    protected model: INetworkModel;
    
    constructor( component: INetworkComponent, controller: INetworkController, model: INetworkModel ) {
        super();
        
        this.component = component;
        this.controller = controller;
        this.model = model;
    }
}
