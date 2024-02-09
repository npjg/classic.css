'use client';

import * as React from "react";
import PlatinumApp from "../components/PlatinumApp";
import PlatinumAppContext, {defaultAppContext} from "../components/PlatinumAppContext";
import {useDesktop, useDesktopDispatch} from "../components/PlatinumDesktopContext";
import PlatinumDesktopIcon from "../components/PlatinumDesktopIcon";
import PlatinumWindow from "../components/PlatinumWindow";

const Demo = () => {
    const [appContext, setAppContext] = React.useState(defaultAppContext);
    const [appOpen, setAppOpen] = React.useState(false);

    const appName = "Demo";
    const appId = "Demo.app";
    const appIcon = "/img/icons/folders/default.png";
    const desktopContext = useDesktop();
    const desktopEventDispatch = useDesktopDispatch();

    const closeApp = (e) => {
        setAppOpen(false);
        desktopEventDispatch({
            type: "PlatinumAppClose",
            app: {
                id: appId,
                title: appName,
                icon: appIcon
            }

        });
    };

    const openApp = (e) => {
        setAppOpen(true);
        desktopEventDispatch({
            type: "PlatinumAppOpen",
            app: {
                id: appId,
                title: appName,
                icon: appIcon
            }

        });
    };

    return (
        <PlatinumAppContext.Provider value={{appContext, setAppContext}}>
            <PlatinumDesktopIcon
                appId={appId}
                appName={appName}
                icon={appIcon}
                onDoubleClickFunc={openApp}
                initialPosition={[30, 200]}
            />
            <PlatinumApp
                id={appId}
                name={appName}
                icon={appIcon}
                debug={false}
                hidden={!appOpen}
            >
                <PlatinumWindow
                    id={"demo"}
                    title={appName}
                    appId={appId}
                    closable={true}
                    resizable={true}
                    zoomable={true}
                    scrollable={false}
                    collapsable={true}
                    initialSize={[100, 500]}
                    initialPosition={[100, 100]}
                    modalWindow={false}>
                    <iframe src={"https://theoldnet.com/"}
                            style={{width: "100%", height: "100%", padding: "0", margin: "0"}}/>
                </PlatinumWindow>
            </PlatinumApp>
        </PlatinumAppContext.Provider>
    );
}

export default Demo;
