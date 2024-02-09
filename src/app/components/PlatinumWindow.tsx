"use client";
import classNames from "classnames";
import {Howl} from 'howler';
import * as React from "react";
import UrlSafeString from "url-safe-string";
import useSound from 'use-sound';
import PlatinumContextMenu from "./PlatinumContextMenu";

import {PlatinumMenuItem} from "./PlatinumMenu";
import platinumWindowStyle from "./PlatinumWindow.module.scss";
import "./styles/fonts.scss";
import {PlatinumWindowStateEventReducer} from "./PlatinumWindowContext";
import {useDesktop, useDesktopDispatch} from './PlatinumDesktopContext';

interface PlatinumWindowProps {
    title: string;
    id?: string;
    appId?: string;
    icon?: string;
    hidden?: boolean;
    closable?: boolean;
    zoomable?: boolean;
    collapsable?: boolean;
    resizable?: boolean;
    scrollable?: boolean;
    modalWindow?: boolean;
    initialSize?: [number, number];
    initialPosition?: [number, number];
    appMenu?: PlatinumMenuItem[];
    contextMenuItems?: PlatinumMenuItem[];
    children?: React.ReactNode;
}

const PlatinumWindow: React.FC<PlatinumWindowProps> = ({
                                                           id,
                                                           title = "Untitled",
                                                           icon = "/img/icons/document.png",
                                                           appId = id,
                                                           hidden = false,
                                                           closable = true,
                                                           zoomable = true,
                                                           collapsable = true,
                                                           resizable = true,
                                                           scrollable = true,
                                                           modalWindow = false,
                                                           initialSize = [300, 400],
                                                           initialPosition = [0, 0],
                                                           appMenu,
                                                           contextMenuItems,
                                                           children,
                                                       }) => {

    const [size, setSize] = React.useState<[number, number]>(initialSize);
    const [clickPosition, setClickPosition] = React.useState<[number, number]>([
        0, 0,
    ]);

    let initialWindowState = {
        size: initialSize,
        position: initialPosition,
        closed: hidden,
    };

    const clickOffset = [10, 10];

    const [windowState, windowEventDispatch] = React.useReducer(
        PlatinumWindowStateEventReducer,
        initialWindowState
    );

    const windowRef = React.useRef(null);
    const desktopContext = useDesktop();
    const desktopEventDispatch = useDesktopDispatch();

    const [play, controller] = useSound(desktopContext.soundTheme.file, {
        sprite: desktopContext.soundTheme.sprite,
        interrupt: true
    });

    const playSound = (soundName: string) => {
        let sound = new Howl({
            src: [desktopContext.soundTheme.file],
            sprite: desktopContext.soundTheme.sprite
        });
        sound.load();

        sound.play(soundName);
    }

    const startResizeWindow = () => {
        setResize(true);
        setZoom(false);
    };

    const changeWindow = (e) => {
        if (windowState.resizing || windowState.dragging) {
            setActive();
        }

        if (windowState.resizing) {
            setSize([
                Math.abs(windowState.position[0] - e.clientX - 4),
                Math.abs(windowState.position[1] - e.clientY - 4),
            ]);
        }

        if (windowState.dragging) {
            playSound("PlatinumWindowMoveMoving");
            setMoving(true, [
                e.clientX - clickPosition[0],
                e.clientY - clickPosition[1],
            ]);
        }
    };

    const isActive = () => {
        return id === desktopContext.activeWindow;
    };

    const setActive = () => {
        if (!isActive()) {
            playSound("PlatinumWindowFocus");
        }
        desktopEventDispatch({
            type: "PlatinumWindowFocus",
            app: {
                id: id,
            }
        });
        desktopEventDispatch({
            type: "PlatinumWindowMenu",
            menuBar: appMenu ? appMenu : [],
        });
    };

    const stopChangeWindow = () => {
        setResize(false);
        setDragging(false);
        setMoving(false);
        setClickPosition([0, 0]);
    };

    const startDrag = (e) => {
        setDragging(true);
        setClickPosition([
            e.clientX - windowRef.current.getBoundingClientRect().left,
            e.clientY - windowRef.current.getBoundingClientRect().top,
        ]);
    };

    const toggleCollapse = () => {
        if (collapsable) {
            setCollapse(!windowState.collapsed);
        }
    };

    const setCollapse = (toCollapse: boolean) => {
        if (toCollapse) {
            playSound("PlatinumWindowCollapse")
            windowEventDispatch({
                type: "PlatinumWindowCollapse",
            });
        } else {
            playSound("PlatinumWindowExpand")
            windowEventDispatch({
                type: "PlatinumWindowExpand",
            });
        }
    };

    const toggleZoom = () => {
        if (zoomable) {
            setZoom(!windowState.zoomed);
        }
    };

    const setZoom = (toZoom: boolean) => {
        if (windowState.collapsed) {
            setCollapse(false);
        }
        playSound("PlatinumWindowZoom");
        windowEventDispatch({
            type: "PlatinumWindowZoom",
            zoomed: toZoom,
        });
    };

    const setContextMenu = (toShow: boolean, atPosition: [number, number]) => {
        windowEventDispatch({
            type: "PlatinumWindowMenu",
            contextMenu: toShow,
            position: atPosition,
        });
    };

    const hideContextMenu = (e) => {

        setContextMenu(false, [0, 0]);
    };

    const showContextMenu = (e) => {
        e.preventDefault();
        setContextMenu(true, [
            e.clientX - clickOffset[0],
            e.clientY - clickOffset[1],
        ]);
    };

    const setResize = (toResize: boolean) => {
        if (resizable) {
            windowEventDispatch({
                type: "PlatinumWindowResize",
                resizing: toResize,
            });
        }
    };

    const close = () => {
        playSound("PlatinumWindowClose");
        windowEventDispatch({
            type: "PlatinumWindowClose",
        });
    };

    const setDragging = (toDrag: boolean) => {
        windowEventDispatch({
            type: "PlatinumWindowDrag",
            dragging: toDrag,
        });
    };

    const setMoving = (
        toMove: boolean,
        toPosition: [number, number] = [0, 0]
    ) => {
        windowEventDispatch({
            type: "PlatinumWindowMove",
            moving: toMove,
            position: toPosition,
        });
    };

    // const firstRender = React.useMemo(
    //     () => setDesktopContext({...desktopContext, activeWindow: id}),
    //     [id, setDesktopContext]
    // );

    return (
        <>
            {!hidden && (
                <div
                    id={!id ? UrlSafeString().generate(title) : id}
                    ref={windowRef}
                    style={{
                        width: size[0],
                        height: size[1],
                        left: windowState.position[0],
                        top: windowState.position[1],
                    }}
                    className={classNames(
                        platinumWindowStyle.platinumWindow,
                        windowState.collapsed === true
                            ? platinumWindowStyle.platinumWindowCollapsed
                            : "",
                        windowState.zoomed === true
                            ? platinumWindowStyle.platinumWindowZoomed
                            : "",
                        isActive()
                            ? platinumWindowStyle.platinumWindowActive
                            : platinumWindowStyle.platinumWindowInactive,
                        windowState.closed === false
                            ? ""
                            : platinumWindowStyle.platinumWindowInvisible,
                        windowState.moving === true
                            ? platinumWindowStyle.platinumWindowDragging
                            : "",
                        windowState.resizing === true
                            ? platinumWindowStyle.platinumWindowResizing
                            : "",
                        modalWindow === true ? platinumWindowStyle.platinumWindowModal : ""
                    )}
                    onMouseMove={changeWindow}
                    onMouseUp={stopChangeWindow}
                    onClick={setActive}
                    onContextMenu={showContextMenu}
                    onMouseOut={hideContextMenu}
                >
                    {contextMenuItems && windowState.contextMenu && (
                        <PlatinumContextMenu
                            menuItems={contextMenuItems}
                            position={windowState.contextMenuLocation}
                        ></PlatinumContextMenu>
                    )}

                    <div
                        className={classNames(
                            platinumWindowStyle.platinumWindowTitleBar,
                            modalWindow === true
                                ? platinumWindowStyle.platinumWindowTitleBarModal
                                : ""
                        )}
                    >
                        {closable && (
                            <div className={platinumWindowStyle.platinumWindowControlBox}>
                                <div
                                    className={platinumWindowStyle.platinumWindowCloseBox}
                                    onClick={close}
                                ></div>
                            </div>
                        )}
                        <div
                            className={platinumWindowStyle.platinumWindowTitle}
                            onMouseDown={startDrag}
                        >
                            <div
                                className={platinumWindowStyle.platinumWindowTitleleft}
                            ></div>
                            <div className={platinumWindowStyle.platinumWindowIcon}>
                                <img src={icon}/>
                            </div>
                            <div className={platinumWindowStyle.platinumWindowTitleText}>
                                {title}
                            </div>
                            <div
                                className={platinumWindowStyle.platinumWindowTitleright}
                            ></div>
                        </div>
                        {collapsable && (
                            <div className={platinumWindowStyle.platinumWindowControlBox}>
                                <div
                                    className={platinumWindowStyle.platinumWindowCollapseBox}
                                    onClick={toggleCollapse}
                                ></div>
                            </div>
                        )}
                        {zoomable && (
                            <div className={platinumWindowStyle.platinumWindowControlBox}>
                                <div
                                    className={platinumWindowStyle.platinumWindowZoomBox}
                                    onClick={toggleZoom}
                                ></div>
                            </div>
                        )}
                    </div>
                    <div
                        className={classNames(
                            isActive()
                                ? ""
                                : platinumWindowStyle.platinumWindowContentsDimmed,
                            modalWindow === true
                                ? platinumWindowStyle.platinumWindowContentsModal
                                : platinumWindowStyle.platinumWindowContents,
                            scrollable === true
                                ? ""
                                : platinumWindowStyle.platinumWindowNoScroll
                        )}
                        style={{
                            display: windowState.collapsed == true ? "none" : "block",
                        }}
                    >
                        <div
                            className={classNames(
                                platinumWindowStyle.platinumWindowContentsInner,
                                modalWindow === true
                                    ? platinumWindowStyle.platinumWindowContentsModalInner
                                    : ""
                            )}
                        >
                            {children}
                        </div>
                    </div>
                    {resizable && !windowState.collapsed && (
                        <div
                            className={platinumWindowStyle.platinumWindowResizer}
                            onMouseDown={startResizeWindow}
                        ></div>
                    )}
                </div>
            )}
        </>
    );
};

export default PlatinumWindow;
