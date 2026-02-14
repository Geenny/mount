import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { IComponent } from "core/base/construction/component/interface";
export declare class StreamSubscribeComponent extends BaseComponent implements IComponent {
    private streamComponent?;
    emit(event: SubscribeEvent, data: any): void;
}
