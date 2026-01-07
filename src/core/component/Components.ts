import { BaseWorker, PromiseStructType, PromiseMethodType } from "core/base";
import { ComponentConfigType, ComponentStructType } from "./types";
import { ComponentName } from "./enums";
import { output } from "utils/index";
import { Unique } from "utils/unique/Unique";
import { Component } from "./Component";

export class Components extends BaseWorker {
    protected uniqueIDGen: Unique = new Unique(1);
    protected config?: ComponentConfigType;

    protected componentConfigPrepareList: ComponentConfigType[] = [];

    protected componentStructList: ComponentStructType[] = []; 

    protected promiseInitStruct?: PromiseStructType;
    protected promiseStartStruct?: PromiseStructType;

    protected async onInit(): Promise<void> {
        if ( this.promiseInitStruct ) {
            output.log(this, 'Components initialization already in progress, awaiting...');
            return this.promiseInitStruct.promise;
        }

        await super.onInit();
        
        this.configPrepareList( this.config );

        await this.componentsInit();
    }



    //
    // COMPONENTS INITIALIZATION
    //

    protected async componentsInit(): Promise<void> {
        const promise = this.promiseInitCreate();

        if ( this.componentConfigPrepareList.length > 0 )
            await this.componentInitReadyCheck();

        return promise;
    }

    protected promiseInitCreate(): Promise<void> {
        const methods: PromiseMethodType = { resolve: () => {} };
        const promise = new Promise<void>( ( resolve, reject ) => {
            methods.resolve = resolve;
            methods.reject = reject;
        });

        this.promiseInitStruct = { promise, method: methods };

        return promise;
    }

    protected componentStructCreateByConfig( config: ComponentConfigType ): ComponentStructType {
        const ComponentClass = config.instance || Component;
        const component = new ComponentClass();

        return { component, config };
    }

    /**
     * Рекурсивная проверка готовности компонентов к инициализации
     */
    protected async componentInitReadyCheck(): Promise<void> {
        const componentsToInit = this.componentsToInitGet();

        // Если нечего инициализировать или все готово
        if ( componentsToInit.length === 0 && this.componentConfigPrepareList.length === 0 ) {
            this.promiseInitStruct?.method.resolve();
            return;
        }

        // Защита от зацикливания
        if ( componentsToInit.length === 0 || componentsToInit.length > this.componentConfigPrepareList.length ) {
            output.error(this, 'Components initialization error: cyclic or broken dependencies detected');
            this.promiseInitStruct?.method.reject?.( new Error( 'Cyclic or broken dependencies detected' ) );
            return;
        }

        // Инициализация готовых компонентов
        if ( componentsToInit.length > 0 ) {
            for ( const config of componentsToInit ) {
                await this.componentInit( config );
                
            }

            this.componentsRemoveByInit( componentsToInit );
        }

        await this.componentInitReadyCheck();
    }

    protected async componentInit( config: ComponentConfigType ): Promise<void> {
        const componentStruct = this.componentStructCreateByConfig( config );
        const { component } = componentStruct;

        await component.init( config );
        
        this.componentAddToList( componentStruct );
    }

    protected componentsToInitGet(): ComponentConfigType[] {
        return this.componentConfigPrepareList.filter( ( config ) => {
            const { dependent } = config;

            if ( !dependent || dependent.length === 0 ) return true;

            const dependencies = this.componentStructList.filter( ( componentStruct ) => dependent.find( ( name ) => componentStruct.component.name === name && componentStruct.component.isInit ) );
            const dependentReady = dependencies.length === dependent.length;
            
            return dependentReady;
        } );
    }

    protected componentsRemoveByInit( componentsToInit: ComponentConfigType[] ): void {
        for ( const config of componentsToInit ) {
            this.componentConfigPrepareList = this.componentConfigPrepareList.filter( ( item ) => item !== config );
        }
    }



    //
    // COMPONENT LIST MANAGEMENT
    //

    protected componentAddToList( componentStruct: ComponentStructType ): void {
        this.componentStructList.push( componentStruct );
    }

    protected componentRemoveFromList( componentStruct: ComponentStructType ): void {
        this.componentStructList = this.componentStructList.filter( ( item ) => item !== componentStruct );
    }



    //
    // COMPONENTS START
    //

    protected async onStart(): Promise<void> {
        await super.onStart();
        
        const promise = this.promiseStartCreate();

        if ( this.componentStructList.length > 0 )
            await this.componentStartReadyCheck();

        return promise;
    }

    protected promiseStartCreate(): Promise<void> {
        const methods: PromiseMethodType = { resolve: () => {} };
        const promise = new Promise<void>( ( resolve, reject ) => {
            methods.resolve = resolve;
            methods.reject = reject;
        });

        this.promiseStartStruct = { promise, method: methods };

        return promise;
    }

    /**
     * Рекурсивная проверка готовности компонентов к запуску
     */
    protected async componentStartReadyCheck(): Promise<void> {
        const componentsToStart = this.componentsToStartGet();

        // Если все запущены
        if ( componentsToStart.length === 0 ) {
            this.promiseStartStruct?.method.resolve();
            return;
        }

        // Запуск готовых компонентов
        if ( componentsToStart.length > 0 ) {
            for ( const component of componentsToStart ) {
                await this.componentStart( component );
            }
        }

        await this.componentStartReadyCheck();
    }

    protected async componentStart( component: Component ): Promise<void> {
        await component.start();
        output.log( component, `Component started: ${ component.name }` );
    }

    protected componentsToStartGet(): Component[] {
        return this.componentStructList
            .filter( ( componentStruct ) => {
                if ( componentStruct.component.isWorking ) return false;

                const { dependent } = componentStruct.config as ComponentConfigType;

                if ( !dependent || dependent.length === 0 ) return true;

                const dependencies = this.componentStructList.filter( ( depStruct ) => dependent.find( ( name: ComponentName ) => depStruct.component.name === name && depStruct.component.isWorking ) );
                const dependentReady = dependencies.length === dependent.length;
                
                return dependentReady;
            } )
            .map( ( componentStruct ) => componentStruct.component );
    }




    //
    // CONFIG PREPARATION
    //

    protected configPrepareList( config?: ComponentConfigType ): void {
        if ( !config ) return;

        this.componentConfigPrepareList = [];

        const processConfig = ( configRaw: ComponentConfigType, componentNameParent?: ComponentName ) => {
            const config = this.configPrepareFromRaw( configRaw );

            if ( componentNameParent ) {
                if ( !config.dependent ) config.dependent = [];
                config.dependent.push( componentNameParent );
            }

            this.componentConfigPrepareList.push( config );

            if ( configRaw.components ) {
                for ( const key in configRaw.components ) {
                    const childConfig = configRaw.components[ key ] as ComponentConfigType;
                    processConfig( childConfig, config.name );
                }
            }
        };

        processConfig( config );
    }

    protected configPrepareFromRaw( config: ComponentConfigType ): ComponentConfigType {
        const clone: ComponentConfigType = { ...config };

        // Unique
        clone.ID = this.uniqueIDGen.next();

        // By default
        if ( !clone.hasOwnProperty( 'unique' ) ) clone.unique = false;
        if ( !clone.hasOwnProperty( 'syncStart' ) ) clone.syncStart = true;

        if ( clone.components ) {
            delete clone.components;
        }

        return clone;
    }

}