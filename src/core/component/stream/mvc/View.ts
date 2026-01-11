import { BaseView } from "core/base/construction/component/BaseView";
import { Subject } from "rxjs";
import { output } from "utils/index";

const STREAM = 'STREAM';

export class View extends BaseView {

    private list: Map<string, Subject<any>> = new Map();

    emit( type: string, data: any ): void {
        if ( !this.isWorking ) {
            output.error( this, 'StreamComponent: Is not working!!!' );
            return;
        }

        if ( !type ) {
            output.error( this, 'StreamComponent: Type is not defined' );
            return;
        }

        const subject = this.subjectGet( type );

        subject.next( data );
    }

    subscribe( type: string, callback: ( data: any ) => void ): void {
        if ( !this.isWorking ) {
            output.error( this, 'StreamComponent: Is not working!!!' );
            return;
        }

        if ( !type ) {
            output.error( this, 'StreamComponent: Type is not defined' );
            return;
        }

        const subject = this.subjectGet( type );

        subject.subscribe( {
            next: ( data: any ) => {
                callback( data );
            }
        } );
    }

    protected subjectGet( type: string ): Subject<any> {
        let subject = this.list.get( type );

        if ( !subject ) {
            subject = new Subject<any>();
            this.list.set( type, subject );
        }

        return subject;
    }

}