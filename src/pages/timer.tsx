import { Timer as TimerComponent } from "../components/timer"

import React from "react";
import { PaddedCenteredContainer, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { YouTube } from "../components/youtube";
export function Timer() {
    return <>
        <PaddedCenteredContainer>
            <Wrap>
                <TimerComponent />
                <Textbox />
            </Wrap>
        </PaddedCenteredContainer>
        <YouTube />
    </>
}