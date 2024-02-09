//     # Events
//     * `PlatinumDesktopFocus`
//     * `PlatinumDesktopDoubleClick`
//     * `PlatinumDesktopDrag`
//     * `PlatinumDesktopStop`
//     * `PlatinumDesktopContextMenu`
//     * `PlatinumDesktopTheme`
//     * `PlatinumDesktopSoundTheme`

//     * `PlatinumWindowOpen`
//     * `PlatinumWindowClose`
//     * `PlatinumWindowFocus`

import {PlatinumMenuItem} from "./PlatinumMenu";

interface PlatinumDesktopState {
    activeTheme: string;
    selectedDesktopIcons: string[];
    soundTheme: {};
    activeWindow: string;
    menuBar: PlatinumMenuItem[];
    systemMenu: PlatinumMenuItem[];
    openApps: PlatinumMenuItem[];
    contextMenu: PlatinumMenuItem[];
    showContextMenu: boolean;
    selectBox: boolean;
    selectBoxSize: number[];
    selectBoxStart: number[]
}

