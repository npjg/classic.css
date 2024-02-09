'use client';
import * as React from "react";
import {useDesktop, useDesktopDispatch} from './PlatinumDesktopContext';
import PlatinumAppContext from "./PlatinumAppContext";
import PlatinumWindow from "./PlatinumWindow";

interface PlatinumAppProps {
    id: string;
    name: string;
    icon: string;
    hidden: boolean;
    desktop?: boolean;
    debug?: boolean;
    open?: boolean;
    children?: any;
}

const PlatinumApp: React.FC<PlatinumAppProps> = (
    {id, icon, name, open = false, hidden = false, debug, children}
) => {
    const {appContext, setAppContext} = React.useContext(PlatinumAppContext);
    const desktopContext = useDesktop();
    const desktopEventDispatch = useDesktopDispatch();

    const isOpen = (e) => {
        const idx = desktopContext.openApps.findIndex(o => o.id === id);
        return idx > -1;
    };

    return (
        <>
            {debug &&
                <PlatinumWindow initialSize={[400, 300]}
                                initialPosition={[100, 200]}
                                title={"DEBUG " + name}
                                id={id + "_debugger"}
                                appId={id}
                                appMenu={[{id: "Debug", title: "Debug"}]}
                >
                    <b>appContext</b>
                    <pre>
                        <code>
                        {JSON.stringify(appContext, null, 2)}
                        </code>
                    </pre>
                    <br/>
                    <b>desktopContext</b>
                    <pre>
                        <code>
                    <code>{JSON.stringify(desktopContext, null, 2)}</code>
                        </code>
                    </pre>

                </PlatinumWindow>
            }
            {!hidden &&
                <>
                    {children}
                </>
            }
        </>
    );
};

export default PlatinumApp;
