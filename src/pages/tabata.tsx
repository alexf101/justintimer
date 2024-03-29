import { Tabata as TabataComponent } from "../components/tabata";

import React from "react";
import { PaddedCenteredContainer, Wrap } from "../components/shared_ui";
import { Textbox } from "../components/textbox";
import { YouTube } from "../components/youtube";
export function Tabata() {
    return (
        <>
            <PaddedCenteredContainer>
                <Wrap>
                    <TabataComponent />
                    <Textbox />
                </Wrap>
            </PaddedCenteredContainer>
            <YouTube />
        </>
    );
}
