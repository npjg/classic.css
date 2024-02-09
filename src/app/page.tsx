'use client';

import {PlatinumDesktopProvider} from "./components/PlatinumDesktopContext";
import * as React from "react";
import PlatinumDesktop from "./components/PlatinumDesktop";

// Apps
import AppearanceManager from "./applications/AppearanceManager";
import Finder from "./applications/Finder";
import Demo from "./applications/Demo";
import TextEdit from "./applications/TextEdit";

export default function Home() {

    const activeTheme = "default";

    return (
        <PlatinumDesktopProvider>
            <PlatinumDesktop theme={activeTheme}>
                <AppearanceManager/>
                <Demo/>
                <TextEdit/>
                <Finder/>
            </PlatinumDesktop>
        </PlatinumDesktopProvider>
    );
}
