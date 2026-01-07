import { BaseSubscription } from "../subscription/BaseSubscription";

export abstract class BaseComponent extends BaseSubscription {

    get ID(): number | undefined {
        return this.config?.ID;
    }

    get name(): string | undefined {
        return this.config?.name;
    }

    get isUnique(): boolean {
        return !!this.config?.unique;
    }

    get isSyncStart(): boolean {
        return !!this.config?.syncStart;
    }

    // controllers: BaseController[] = [];
    
    // model: BaseModel;

    // view?: BaseView;

    

}