/**
 * Network Component Tests
 * 
 * Basic tests for NetworkComponent initialization and Model/View/Controller structure
 * 
 * NOTE: Full integration tests with connectors require mount_server to be running
 */

import { NetworkComponent } from '../core/components/network/NetworkComponent';
import { StreamComponent } from '../core/components/stream/StreamComponent';
import { ComponentNameEnum, ComponentTypeEnum } from '../core/components/enums';

describe( 'NetworkComponent', () => {
    
    describe( 'Initialization', () => {
        test( 'should create and initialize network component', async () => {
            const streamComponent = new StreamComponent();
            await streamComponent.init( {
                name: ComponentNameEnum.STREAM,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            } );
            await streamComponent.start();
            
            const networkComponent = new NetworkComponent();
            
            const networkConfig = {
                name: ComponentNameEnum.NETWORK,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            };
            
            await networkComponent.init( networkConfig );
            expect( networkComponent.isInit ).toBe( true );
            
            await networkComponent.start();
            
            await networkComponent.stop();
            await streamComponent.stop();
        }, 10000 );
        
        test( 'should have MVC structure', async () => {
            const streamComponent = new StreamComponent();
            await streamComponent.init( {
                name: ComponentNameEnum.STREAM,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            } );
            await streamComponent.start();
            
            const networkComponent = new NetworkComponent();
            await networkComponent.init( {
                name: ComponentNameEnum.NETWORK,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            } );
            
            const model = ( networkComponent as any ).model;
            const view = ( networkComponent as any ).view;
            const controller = ( networkComponent as any ).controller;
            
            expect( model ).toBeDefined();
            expect( view ).toBeDefined();
            expect( controller ).toBeDefined();
            
            await networkComponent.stop();
            await streamComponent.stop();
        }, 10000 );
        
        test( 'should initialize model with correct data structures', async () => {
            const streamComponent = new StreamComponent();
            await streamComponent.init( {
                name: ComponentNameEnum.STREAM,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            } );
            await streamComponent.start();
            
            const networkComponent = new NetworkComponent();
            await networkComponent.init( {
                name: ComponentNameEnum.NETWORK,
                type: ComponentTypeEnum.SERVICE,
                unique: true
            } );
            
            const model = ( networkComponent as any ).model;
            
            expect( model.requestQueues ).toBeDefined();
            expect( model.activeRequests ).toBeDefined();
            expect( model.caches ).toBeDefined();
            expect( model.stats ).toBeDefined();
            
            expect( model.requestQueues instanceof Map ).toBe( true );
            expect( model.activeRequests instanceof Map ).toBe( true );
            expect( model.caches instanceof Map ).toBe( true );
            
            expect( model.stats.totalRequests ).toBe( 0 );
            expect( model.stats.successRequests ).toBe( 0 );
            expect( model.stats.errorRequests ).toBe( 0 );
            
            await networkComponent.stop();
            await streamComponent.stop();
        }, 10000 );
    } );
} );
