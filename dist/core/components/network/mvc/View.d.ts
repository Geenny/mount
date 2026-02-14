import { BaseView } from "core/base/construction/component/BaseView";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
/**
 * Network component view
 */
export declare class View extends BaseView implements INetworkView {
    protected component: INetworkComponent;
    protected controller: INetworkController;
    protected model: INetworkModel;
    constructor(component: INetworkComponent, controller: INetworkController, model: INetworkModel);
}
