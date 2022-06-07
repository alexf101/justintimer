import React from "react";
import { PaddedCenteredContainer, SideBySide, SingleColumnDisplay, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { Timer } from "../components/timer";
export function DualTimer() {
    return <>
        <PaddedCenteredContainer>
            <SideBySide>
                    <SingleColumnDisplay>
                        <Timer />
                        <Textbox />
                    </SingleColumnDisplay>
                    <SingleColumnDisplay>
                        <Timer />
                        <Textbox />
                    </SingleColumnDisplay>
            </SideBySide>
        </PaddedCenteredContainer>
    </>
}