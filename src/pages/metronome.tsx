import { Stopwatch as StopwatchComponent } from "../components/stopwatch";
import { Metronome as MetronomeComponent } from "../components/metronome";

import React from "react";
import { PaddedCenteredContainer, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { YouTube } from "../components/youtube";
export function Metronome() {
    return (
        <>
            <PaddedCenteredContainer>
                <Wrap>
                    <StopwatchComponent />
                    <MetronomeComponent />
                    <Textbox />
                </Wrap>
            </PaddedCenteredContainer>
            <YouTube />
        </>
    );
}
