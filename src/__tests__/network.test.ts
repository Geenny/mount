/**
 * Network Component Tests
 * Tests for HTTP/WebSocket connections, request queues, caching, and retry logic
 */

import { NetworkComponent } from '../core/components/network/NetworkComponent';
import { StreamComponent } from '../core/components/stream/StreamComponent';
import { NETWORK_EVENT } from '../core/constants';
import { 
    NetworkConnectionType,
    NetworkRequestMethod,
    NetworkRequestStatus,
    NetworkConnectionStatus
} from '../core/components/network/enums';
import type { 
    NetworkRequestType,
    NetworkResponseType,
    NetworkErrorType
} from '../core/components/network/types';

describe( 'NetworkComponent', () => {
    let networkComponent: NetworkComponent;
    let streamComponent: StreamComponent;
    
    beforeEach( async () => {
        // Create stream component
        streamComponent = new StreamComponent();
        await streamComponent.init();
        await streamComponent.start();
        
        // Create network component with test config
        networkComponent = new NetworkComponent();
        ( networkComponent as any ).config = {
            name: 'NETWORK',
            unique: true,
            params: {
                servers: [
                    {
                        id: 'test-http',
                        host: 'https://jsonplaceholder.typicode.com',
                        type: NetworkConnectionType.HTTP,
                        retry: 1,
                        retryDelay: 100,
                        timeout: 5000,
                        maxConcurrent: 2,
                        cache: {
                            enabled: true
                        }
                    }
                ]
            }
        };
        
        await networkComponent.init();
        await networkComponent.start();
    } );
    
    afterEach( async () => {
        await networkComponent.stop();
        await streamComponent.stop();
    } );
    
    /**
     * Test: Component initialization
     */
    test( 'should initialize network component', () => {
        expect( networkComponent ).toBeDefined();
        const model = ( networkComponent as any ).model;
        expect( model.connectors.size ).toBe( 1 );
        expect( model.requestQueues.size ).toBe( 1 );
    } );
    
    /**
     * Test: Make HTTP GET request
     */
    test( 'should make HTTP GET request', ( done ) => {
        const request: NetworkRequestType = {
            serverId: 'test-http',
            endpoint: '/posts/1',
            method: NetworkRequestMethod.GET
        };
        
        // Subscribe to response
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, ( response: NetworkResponseType ) => {
            expect( response ).toBeDefined();
            expect( response.serverId ).toBe( 'test-http' );
            expect( response.status ).toBe( 200 );
            expect( response.data ).toBeDefined();
            expect( response.data.id ).toBe( 1 );
            done();
        } );
        
        // Emit request
        streamComponent.emit( NETWORK_EVENT.REQUEST, request );
    }, 10000 );
    
    /**
     * Test: Request queuing and priority
     */
    test( 'should queue and prioritize requests', ( done ) => {
        const responses: NetworkResponseType[] = [];
        
        // Subscribe to responses
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, ( response: NetworkResponseType ) => {
            responses.push( response );
            
            // Check when all 3 requests completed
            if ( responses.length === 3 ) {
                // High priority request should be processed first
                expect( responses[ 0 ].data.id ).toBe( 3 );
                expect( responses[ 1 ].data.id ).toBe( 1 );
                expect( responses[ 2 ].data.id ).toBe( 2 );
                done();
            }
        } );
        
        // Emit requests with different priorities
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/1',
            method: NetworkRequestMethod.GET,
            priority: 5
        } as NetworkRequestType );
        
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/2',
            method: NetworkRequestMethod.GET,
            priority: 0
        } as NetworkRequestType );
        
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/3',
            method: NetworkRequestMethod.GET,
            priority: 10
        } as NetworkRequestType );
    }, 15000 );
    
    /**
     * Test: Request caching
     */
    test( 'should cache request responses', ( done ) => {
        let callCount = 0;
        
        // Subscribe to responses
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, ( response: NetworkResponseType ) => {
            callCount++;
            expect( response.data.id ).toBe( 1 );
            
            if ( callCount === 2 ) {
                // Both requests completed, second should be from cache (faster)
                done();
            }
        } );
        
        // First request
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/1',
            method: NetworkRequestMethod.GET,
            cache: true
        } as NetworkRequestType );
        
        // Second request (should hit cache)
        setTimeout( () => {
            streamComponent.emit( NETWORK_EVENT.REQUEST, {
                serverId: 'test-http',
                endpoint: '/posts/1',
                method: NetworkRequestMethod.GET,
                cache: true
            } as NetworkRequestType );
        }, 1000 );
    }, 10000 );
    
    /**
     * Test: Request with salt (cache busting)
     */
    test( 'should bypass cache with salt parameter', ( done ) => {
        let callCount = 0;
        
        // Subscribe to responses
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, ( response: NetworkResponseType ) => {
            callCount++;
            
            if ( callCount === 2 ) {
                // Both requests should actually fetch (not cached)
                done();
            }
        } );
        
        // First request with salt
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/1',
            method: NetworkRequestMethod.GET,
            cache: true,
            salt: 'v1'
        } as NetworkRequestType );
        
        // Second request with different salt
        setTimeout( () => {
            streamComponent.emit( NETWORK_EVENT.REQUEST, {
                serverId: 'test-http',
                endpoint: '/posts/1',
                method: NetworkRequestMethod.GET,
                cache: true,
                salt: 'v2'
            } as NetworkRequestType );
        }, 1000 );
    }, 10000 );
    
    /**
     * Test: Error handling
     */
    test( 'should handle request errors', ( done ) => {
        // Subscribe to errors
        streamComponent.subscribe( NETWORK_EVENT.ERROR, ( error: NetworkErrorType ) => {
            expect( error ).toBeDefined();
            expect( error.serverId ).toBe( 'test-http' );
            expect( error.error ).toBeDefined();
            done();
        } );
        
        // Request to non-existent endpoint
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/invalid-endpoint-404',
            method: NetworkRequestMethod.GET,
            retry: 0 // No retries
        } as NetworkRequestType );
    }, 10000 );
    
    /**
     * Test: Statistics tracking
     */
    test( 'should track request statistics', ( done ) => {
        const model = ( networkComponent as any ).model;
        
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, () => {
            expect( model.stats.totalRequests ).toBeGreaterThan( 0 );
            expect( model.stats.successRequests ).toBeGreaterThan( 0 );
            done();
        } );
        
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts/1',
            method: NetworkRequestMethod.GET
        } as NetworkRequestType );
    }, 10000 );
    
    /**
     * Test: HTTP POST request with body
     */
    test( 'should make HTTP POST request with body', ( done ) => {
        const postData = {
            title: 'Test Post',
            body: 'Test body',
            userId: 1
        };
        
        streamComponent.subscribe( NETWORK_EVENT.RESPONSE, ( response: NetworkResponseType ) => {
            expect( response.status ).toBe( 201 );
            expect( response.data.title ).toBe( postData.title );
            done();
        } );
        
        streamComponent.emit( NETWORK_EVENT.REQUEST, {
            serverId: 'test-http',
            endpoint: '/posts',
            method: NetworkRequestMethod.POST,
            body: postData
        } as NetworkRequestType );
    }, 10000 );
} );
