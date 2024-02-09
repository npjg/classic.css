'use client';
import * as React from "react";
import platinumContextMenuStyles from "./PlatinumContextMenu.module.scss";
import platinumMenuStyles from "./PlatinumMenu.module.scss";
import PlatinumMenu, {PlatinumMenuItem} from "./PlatinumMenu";

interface PlatinumMenuProps {
    position: number[];
    menuItems: PlatinumMenuItem[];
}

const PlatinumContextMenu: React.FC<PlatinumMenuProps> = ({menuItems, position}) => {

    return (
        <div className={platinumContextMenuStyles.platinumContextMenuWrapper}
             style={{left: position[0], top: position[1]}}>
            <PlatinumMenu menuItems={menuItems} subNavClass={platinumMenuStyles.platinumContextSubMenu}></PlatinumMenu>
        </div>
    )
};

export default PlatinumContextMenu;

