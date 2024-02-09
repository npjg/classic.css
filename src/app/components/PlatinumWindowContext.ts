//     # Events
//     * `PlatinumWindowOpen`
//     * `PlatinumWindowClose`
//     * `PlatinumWindowResize`
//     * `PlatinumWindowDrag`
//     * `PlatinumWindowMove`
//     * `PlatinumWindowStop`
//     * `PlatinumWindowFocus`
//     * `PlatinumWindowContentScroll`
//     * `PlatinumWindowContentClick`
//     * `PlatinumWindowMenu`

//     # WindowState
//     initialWindowState = {
//         size: string;
//         position: string;
//         clickPosition: [number, number];
//         zoomed: boolean,
//         collapsed: boolean,
//         dragging: boolean,
//         resizing: boolean,
//         sounding: boolean,
//         moving: boolean,
//     };

export const PlatinumWindowStateEventReducer = (ws, action) => {
    if (action.type.startsWith("PlatinumWindow")) {
        switch (action.type.replace("PlatinumWindow", "").toLowerCase()) {
            case "open": {
                ws.closed = false;
                break;
            }
            case "close": {
                ws.closed = true;
                break;
            }
            case "resize": {
                ws.resizing = action.resizing;
                break;
            }
            case "zoom": {
                ws.zoomed = action.zoomed;
                break;
            }
            case "focus": {
                break;
            }
            case "expand": {
                ws.collapsed = false;
                break;
            }
            case "collapse": {
                ws.collapsed = true;
                break;
            }
            case "drag": {
                ws.dragging = action.dragging;
                break;
            }
            case "menu": {
                ws.contextMenu = action.contextMenu;
                if (action.contextMenu === true) {
                    ws.contextMenuLocation = action.position;
                }
                break;
            }
            case "move": {
                ws.moving = action.moving;
                if (action.moving === true) {
                    ws.position = action.position;
                }
                break;
            }
        }
    }
    return {...ws};
};

