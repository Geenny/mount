import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";

export class ApplicationComponent extends StreamSubscribeComponent {

    onEvent(event: string, data?: any): void {
        console.log(`ApplicationComponent received event: ${event}`, data);
    }
    
}