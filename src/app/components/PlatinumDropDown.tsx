import React from "react";
import platinumDropDownStyle from "./PlatinumDropDown.module.scss";
import classNames from "classnames";

const PlatinumDropdown = ({id, options, selected, small, onChangeFunc}) => {
    return (
        <div
            className={classNames(platinumDropDownStyle.platinumDropDown, small ? platinumDropDownStyle.platinumDropDownSmall : "")}>
            <select
                id={id}
                value={selected}
                onChange={onChangeFunc}>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
};
export default PlatinumDropdown;

