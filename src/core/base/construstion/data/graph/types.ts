type NodeStringAssocStruct = { name: string, instance: any, names: string[] };

type NodeStruct = { edges: NodeStruct[] } & NodeStringAssocStruct;

export { NodeStruct, NodeStringAssocStruct };