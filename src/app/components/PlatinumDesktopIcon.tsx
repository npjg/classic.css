'use client';
import classNames from "classnames";
import * as React from "react";
import "./styles/fonts.scss";
import {useDesktop, useDesktopDispatch} from './PlatinumDesktopContext';

import platinumDesktopIconStyles from "./PlatinumDesktopIcon.module.scss";

interface PlatinumDesktopIconProps {
    appId: string;
    appName: string;
    icon: string;
    onClickFunc?: any;
    onDoubleClickFunc?: any;
    initialPosition: [number, number];
}

const PlatinumDesktopIcon: React.FC<PlatinumDesktopIconProps> = ({
                                                                     appId,
                                                                     appName,
                                                                     icon,
                                                                     initialPosition,
                                                                     onClickFunc,
                                                                     onDoubleClickFunc
                                                                 }) => {

    const [position, setPosition] = React.useState<[number, number]>(initialPosition || [0, 0]);
    const [clickPosition, setClickPosition] = React.useState<[number, number]>([0, 0]);
    const [dragging, setDragging] = React.useState<boolean>(false);

    const desktopContext = useDesktop();
    const desktopEventDispatch = useDesktopDispatch();

    const iconRef = React.useRef(null);

    const id = appId + ".shortcut";

    const clickFocus = (e) => {
        desktopEventDispatch({
            type: "PlatinumDesktopIconFocus",
            iconId: id,
        })
    }

    const changeIcon = e => {
        if (dragging) {
            clickFocus(e);
            setPosition([e.clientX - clickPosition[0], e.clientY - clickPosition[1]]);
        }
    };

    const isActive = (id) => {
        const idx = desktopContext.selectedDesktopIcons.findIndex(o => o === id);
        return idx > -1;
    }

    const launchIcon = (e) => {
        desktopEventDispatch({
            type: "PlatinumDesktopIconOpen",
            iconId: id,
            app: {
                id: appId,
                name: appName,
                icon: icon
            },
        })
    };

    const isLaunched = () => {
        const idx = desktopContext.openApps.findIndex(o => o.id === appId);
        return idx > -1;
    };

    const stopChangeIcon = e => {
        setDragging(false);
        setClickPosition([0, 0]);
    };

    const startDrag = (e) => {
        setClickPosition([e.clientX - iconRef.current.getBoundingClientRect().left, e.clientY - iconRef.current.getBoundingClientRect().top])
        setDragging(true);
    };


    const getClass = (id) => {
        if (isActive(id) && isLaunched()) {
            return platinumDesktopIconStyles.platinumDesktopIconActiveAndOpen
        } else if (isActive(id)) {
            return platinumDesktopIconStyles.platinumDesktopIconActive
        } else if (isLaunched()) {
            return platinumDesktopIconStyles.platinumDesktopIconOpen
        } else {
            return "";
        }
    }
    const getTheme = (color: string) => {
        return platinumDesktopIconStyles["platinumDesktopIconMaskTheme" + color.charAt(0).toUpperCase() + color.slice(1)];
    }

    return (
        <div ref={iconRef} id={`${id} ${Math.floor(Math.random() * 100)}`}
             onMouseDown={startDrag}
             onMouseMove={changeIcon}
             onMouseUp={stopChangeIcon}
             onDoubleClick={(e) => {
                 launchIcon(e);
                 onDoubleClickFunc();
             }}
             draggable={false}
             onClick={clickFocus}
             className={classNames(
                 platinumDesktopIconStyles.platinumDesktopIcon,
                 dragging ? platinumDesktopIconStyles.platinumDesktopIconDragging : "",
                 getClass(id)
             )}
             style={{
                 left: position[0],
                 top: position[1],
             }}
        >
            <div className={platinumDesktopIconStyles.platinumDesktopIconMaskOuter}
                 style={{maskImage: `url(${icon})`}}>
                <div
                    className={classNames(platinumDesktopIconStyles.platinumDesktopIconMask, getTheme(desktopContext.activeTheme || "default"))}
                    style={{mask: `url(${icon})`}}>
                    <img src={icon} alt={appName}/>
                </div>
            </div>
            <p>{appName}</p>
        </div>);
};


export default PlatinumDesktopIcon;
