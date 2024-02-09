'use client';
import * as React from "react";
import platinumProgressStyles from "./PlatinumProgress.module.scss";

interface PlatinumProgressProps {
    max?: number;
    value: number;
}

const PlatinumProgress: React.FC<PlatinumProgressProps> = ({max = 100, value = 0}) => {

    return (
        <div className={platinumProgressStyles.platinumProgress}>
            <progress max={max} value={value}/>
        </div>
    )
};

export default PlatinumProgress;

