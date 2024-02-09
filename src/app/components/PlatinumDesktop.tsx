import classNames from "classnames";
import * as React from "react";
import {Suspense} from "react";
import PlatinumContextMenu from "./PlatinumContextMenu";
import platinumDesktop from "./PlatinumDesktop.module.scss";
import {useDesktop, useDesktopDispatch} from "./PlatinumDesktopContext";
import PlatinumDesktopMenu from "./PlatinumDesktopMenu";


interface PlatinumDesktopProps {
    theme?: string;
    soundTheme?: string;
    children?: any;
}

const PlatinumDesktop: React.FC<PlatinumDesktopProps> = ({
                                                             theme = "default",
                                                             soundTheme = "/sounds/platinum.json",
                                                             children
                                                         }) => {

    const [contextMenu, setContextMenu] = React.useState(false);
    const [contextMenuLocation, setContextMenuLocation] = React.useState([0, 0]);

    const [selectBoxStart, setSelectBoxStart] = React.useState([0, 0]);
    const [selectBoxSize, setSelectBoxSize] = React.useState([0, 0]);
    const [selectBox, setSelectBox] = React.useState(false);


    const clickOffset = [10, 10];

    const desktopState = useDesktop();
    const desktopEventDispatch = useDesktopDispatch();

    // React.useEffect(() => {
    //     if (soundTheme !== "" && desktopState.soundTheme.sprites.length <= 0) {
    //         desktopEventDispatch({
    //             type: "PlatinumDesktopSoundTheme",
    //             soundThemeURL: soundTheme,
    //         });
    //     }
    // }, [desktopState, desktopEventDispatch])


    const getTheme = (color: string) => {
        return platinumDesktop["platinumTheme" + color.charAt(0).toUpperCase() + color.slice(1)];
    }

    const startSelectBox = (e) => {
        if (e.target.id === "platinumDesktop") {
            if (e.button > 1) {
                toggleDesktopContextMenu(e);
            } else {
                clearActives(e);
                setSelectBox(true);
                setSelectBoxStart([e.clientX, e.clientY]);
                setSelectBoxSize([0, 0]);
            }
        }
    }

    const resizeSelectBox = (e) => {
        setSelectBoxSize([e.clientX - selectBoxStart[0], e.clientY - selectBoxStart[1]]);
    }

    const clearSelectBox = (e) => {
        setSelectBoxSize([0, 0]);
        setSelectBoxStart([0, 0]);
        setSelectBox(false);
    }

    const clearActives = (e) => {
        setContextMenu(false);
        desktopEventDispatch({
            type: "PlatinumDesktopFocus",
            e: e,
        });
    }

    const toggleDesktopContextMenu = (e) => {
        if (e.target.id === "platinumDesktop") {
            e.preventDefault();
            setContextMenuLocation([e.clientX - clickOffset[0], e.clientY - clickOffset[1]]);
            setContextMenu(!contextMenu);
        }
    }

    const testMenuItems = [
        {
            id: "help",
            title: "Help",
            disabled: false,
        },
        {
            id: "spacer",
        },
        {
            id: "cleanup",
            title: "New",
            icon: "/img/mac.png",
            keyboardShortcut: "&#8984;S",
            disabled: false,
        },
        {
            id: "arrange",
            title: "Arrange",
            menuChildren: [
                {
                    id: "by-name",
                    title: "by Name"
                },
                {
                    id: "by-date",
                    title: "by Date"
                },
                {
                    id: "by-name",
                    title: "by Kind"
                },
            ]
        },
        {
            id: "file-print",
            title: "Print",
            keyboardShortcut: "&#8984;P",
            disabled: true,
        },
        {
            id: "file-trash",
            title: "Move to Trash",
            keyboardShortcut: "&#8984;&#9003;",
            disabled: true,
        },
        {
            id: "spacer",
            title: "",
        },
        {
            id: "file-close",
            title: "Close Window",
            keyboardShortcut: "&#8984;W",
            disabled: false,
        },

    ];

    return (
        <>
            <Suspense>
                <div id={"platinumDesktop"}
                     className={classNames(getTheme(desktopState.activeTheme), platinumDesktop.platinumDesktop)}
                     onMouseMove={resizeSelectBox}
                     onContextMenu={toggleDesktopContextMenu}
                     onClick={clearSelectBox}
                     onMouseDown={startSelectBox}>
                    {selectBox &&
                        <div className={platinumDesktop.platinumDesktopSelect}
                             style={{
                                 left: selectBoxStart[0],
                                 top: selectBoxStart[1],
                                 width: selectBoxSize[0],
                                 height: selectBoxSize[1]
                             }}/>
                    }
                    <PlatinumDesktopMenu menuItems={desktopState.menuBar}/>
                    {contextMenu && (
                        <PlatinumContextMenu menuItems={testMenuItems}
                                             position={contextMenuLocation}/>
                    )}
                    {children}
                </div>
            </Suspense>
        </>
    );
};

export default PlatinumDesktop;

