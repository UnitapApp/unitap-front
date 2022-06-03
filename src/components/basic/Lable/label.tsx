import React, { ReactNode } from "react";

interface props {
    children: ReactNode;
}

const Label = ({children}:props) => {
    return (
        <>{children}</>
    )
}

export default Label;