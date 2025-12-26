// config.ts - External config for dependencies

export const config = [
    {
        name: "logger",
        factory: async () => {
            const { output } = await import('../utils/output/Output');
            return output;
        }
    },
    {
        name: "http",
        factory: async () => {
            const { http } = await import('../utils/http/Http');
            return http;
        }
    },
    {
        name: "dependency-init",
        factory: async () => {
            const { DependencyInit } = await import('../core/services/DependencyInit');
            const init = new DependencyInit();
            await init.init();
            return init;
        }
    },
    {
        name: "dependency-stream",
        factory: async () => {
            const { DependencyStream } = await import('../core/services/DependencyStream');
            const stream = new DependencyStream();
            await stream.init();
            return stream;
        },
        dependencies: ["dependency-init"]
    },
    {
        name: "dependency-net",
        factory: async () => {
            const { DependencyNet } = await import('../core/services/DependencyNet');
            const net = new DependencyNet();
            await net.init();
            return net;
        },
        dependencies: ["dependency-stream"]
    }
];