'use client'

import { ReactNode, MouseEvent } from "react";

interface Props{
    children: ReactNode
};

export default function OnBoardingSection(props : Props){

    function handleMouseMovementCard(event: MouseEvent){
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    }

    return(
        <section className="mt-9 rounded-md cardglow relative" onMouseMove={(event) => handleMouseMovementCard(event)}>
            <div className="cardglow-content p-10">
                {props.children}
            </div>
        </section>
    );
}