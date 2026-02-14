import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "./interface";
import { SubscribeActionEnum, SubscribeTypeEnum } from "core/base/construction/subscription/enum";
import { SubscribeMessageData } from "core/base/construction/subscription/types";
export declare class StreamComponent extends BaseComponent implements IStreamComponent {
    protected controller?: IStreamController;
    protected model?: IStreamModel;
    protected view?: IStreamView;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
    onMessage(type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData): void;
    protected handleSystemMessage(action: SubscribeActionEnum, messageData: SubscribeMessageData): void;
    protected handleSubscribeMessage(action: SubscribeActionEnum, messageData: SubscribeMessageData): void;
    protected handleDataMessage(action: SubscribeActionEnum, messageData: SubscribeMessageData): void;
}
