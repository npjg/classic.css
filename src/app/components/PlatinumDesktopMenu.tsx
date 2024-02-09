'use client';
import classNames from "classnames";
import * as React from "react";
import platinumDesktopMenuStyles from "./PlatinumDesktopMenu.module.scss";
import PlatinumMenu, {PlatinumMenuItem} from "./PlatinumMenu";
import platinumMenuStyles from "./PlatinumMenu.module.scss";
import {useDesktop} from './PlatinumDesktopContext';

interface PlatinumMenuProps {
    menuItems: PlatinumMenuItem[];
}

const PlatinumDesktopMenu: React.FC<PlatinumMenuProps> = ({menuItems}) => {
    const desktopContext = useDesktop();

    const systemMenuItem: PlatinumMenuItem = {
        id: "apple-menu",
        image: "/img/apple.png",
        menuChildren: desktopContext.systemMenu,
        className: platinumMenuStyles.platinumDesktopMenuAppleMenu
    };

    const timeMenuItemPlaceholder: PlatinumMenuItem = {
        id: "time",
        title: "8:32 PM",
        className: platinumDesktopMenuStyles.platinumDesktopMenuTime,
    }

    const a = desktopContext.openApps[0];

    const openAppsMenuItem: PlatinumMenuItem = {
        id: "app-switcher",
        image: desktopContext.openApps[0].icon,
        title: desktopContext.openApps[0].name,
        className: platinumDesktopMenuStyles.platinumDesktopMenuAppSwitcher,
        menuChildren: desktopContext.openApps.map((app) => ({
                id: app.id,
                icon: app.icon,
                title: app.name
            }
        ))
    }


    const defaultMenuItems = [].concat(
        systemMenuItem,
        menuItems,
        openAppsMenuItem,
        timeMenuItemPlaceholder
    ) as PlatinumMenuItem[];

    const getTheme = (color: string) => {
        return platinumMenuStyles["platinumMenuTheme" + color.charAt(0).toUpperCase() + color.slice(1)];
    }

    return (
        <nav className={classNames(
            platinumDesktopMenuStyles.platinumDesktopMenuBar,
            getTheme(desktopContext.activeTheme
            ))}>
            <PlatinumMenu menuItems={defaultMenuItems} navClass={platinumDesktopMenuStyles.platinumDesktopMenu}
                          subNavClass={platinumMenuStyles.platinumSubMenu}
            ></PlatinumMenu>
        </nav>
    );
};

export default PlatinumDesktopMenu;

