import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { BaseRecipient } from "core/base/construction/recipient/BaseRecipient";
import { RecipientEvent, RecipientMessageData, RecipientSource } from "core/base/construction/recipient/types";
import { StreamInstanceStruct } from "./types";

interface IStreamComponent extends IComponent {

}

interface IStreamModel extends IModel {

}

interface IStreamView extends IView {
    isExist( instance: BaseRecipient ): boolean;
    add( instance: BaseRecipient ): void;
    remove( instance: BaseRecipient ): void;

    byEventGet( event: RecipientEvent ): StreamInstanceStruct[];

    subscribe( instance: BaseRecipient, event: RecipientEvent, method: Function ): void;
    unsubscribe( instance: BaseRecipient, event: RecipientEvent, method: Function ): void;
}

interface IStreamController extends IController {
    instanceAdd( instance: BaseRecipient ): void;
    instanceRemove( instance: BaseRecipient ): void;

    emit( event: RecipientEvent, data: any ): void;

    stream( instance: BaseRecipient, event: RecipientEvent, method: Function ): void;
    unstream( instance: BaseRecipient, event: RecipientEvent, method: Function ): void;
}

export { IStreamComponent, IStreamModel, IStreamView, IStreamController };