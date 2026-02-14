type SystemVisibleDataType = {
    visible: boolean;
};
type SystemKeyboardDataType = {
    action: 'down' | 'up';
    key: string;
    code: number;
    isShift: boolean;
    isCtrl: boolean;
    isAlt: boolean;
};
type SystemResizeDataType = {
    width: number;
    height: number;
};
export { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType };
