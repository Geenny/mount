import { BaseWorker } from "core/base/BaseWorker";
import { RecipientEvent, RecipientMessageData } from "./types";
import { RecipientActionEnum, RecipientTypeEnum } from "./enum";

/**
 * Этот абстрактный класс
 */
export abstract class BaseRecipient extends BaseWorker {

    #subscriberMap: Map<string, BaseRecipient> = new Map();


    //
    // SUBSCRIBERS
    //

    /**
     * Set a @BaseRecipient (as parent) for broadcast messages
     */
    recipientSet( name: string, recipient: BaseRecipient ): void {
        this.#subscriberMap.set( name, recipient );
    }

    /**
     * Get a @BaseRecipient by name
     */
    recipientGet( name: string ): BaseRecipient | undefined {
        return this.#subscriberMap.get( name );
    }


    //
    // MESSAGING
    //

    onMessage( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientMessageData ): void {
        // Override in subclasses
    }

    protected message( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientMessageData ): void {
        this.#subscriberMap.forEach( ( recipient ) => recipient.onMessage( type, action, data ) );
    }



    //
    // LIFECYCLE
    //

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();

        this.#subscriberMap.clear();
    }

}