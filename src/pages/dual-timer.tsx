import React from "react";
import { PaddedCenteredContainer, SingleColumnDisplay, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { Timer } from "../components/timer";
export function DualTimer() {
    return <>
        <PaddedCenteredContainer>
            <Wrap>
                <Wrap>
                    <SingleColumnDisplay>
                        <Timer />
                        <Textbox />
                    </SingleColumnDisplay>
                    <SingleColumnDisplay>
                        <Timer />
                        <Textbox />
                    </SingleColumnDisplay>
                </Wrap>
                {/* <Textbox /> */}
            </Wrap>
        </PaddedCenteredContainer>
    </>
}