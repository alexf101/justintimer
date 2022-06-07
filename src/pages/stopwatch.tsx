import { Stopwatch as StopwatchComponent } from "../components/stopwatch"

import React from "react";
import { PaddedCenteredContainer, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { YouTube } from "../components/youtube";
export function Stopwatch() {
    return <>
        <PaddedCenteredContainer>
            <Wrap>
                <StopwatchComponent />
                <Textbox />
            </Wrap>
        </PaddedCenteredContainer>
        <YouTube />
    </>
}