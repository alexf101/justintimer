import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { Stopwatch } from "./pages/stopwatch";
import { Tabata } from "./pages/tabata";
import { Timer } from "./pages/timer";
import { Howl } from "howler";
import { DualTimer } from "./pages/dual-timer";
import { PaddedCenteredContainer } from "./components/shared_ui";

const TimerChooser = () => {
    return (
        <TimerNavBar>
            <a href="#stopwatch">Stopwatch</a>
            <a href="#timer">Timer</a>
            <a href="#dual-timers">Dual timers</a>
            <a href="#tabata">Tabata</a>
        </TimerNavBar>
    );
};
const TimerNavBar = styled.div`
    margin: 8px auto;
    display: flex;
    justify-content: space-between;
    width: 300px;
    font-size: 1rem;
`;

type pages = "stopwatch" | "timer" | "tabata" | "dual-timers" | "unknown";
function pageSelect(choices: { [K in pages]: React.ReactNode }) {
    let page = window.location.hash.substring(1);
    if (!page || page === "") {
        page = "stopwatch";
    }
    if (!choices.hasOwnProperty(page)) {
        page = "unknown";
    }
    return (choices as any)[page];
}

const escapePodSound = new Howl({ src: ["./escape_hatch.mp3"] });
const Jokes = () => {
    return (
        <JokeContainer>
            <a
                target="_blank"
                href="https://kidadl.com/articles/terrible-puns-that-are-so-bad-theyre-good"
            >
                Terrible puns
            </a>
            <button onClick={() => escapePodSound.play()}>
                Launch escape pod
            </button>
        </JokeContainer>
    );
};
const JokeContainer = styled.div`
    display: flex;
    gap: 16px;
`;

const App = () => {
    const [page, setPage] = useState("");
    useEffect(() => {
        const onHashChange = () => setPage(window.location.hash);
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    });
    return (
        <div>
            <PaddedCenteredContainer>
                <TimerChooser />
            </PaddedCenteredContainer>
            {pageSelect({
                        timer: <Timer />,
                        stopwatch: <Stopwatch />,
                "dual-timers": <DualTimer />,
                        tabata: <Tabata />,
                        unknown: "not found",
            })}
            <PaddedCenteredContainer>
                <Jokes />
            </PaddedCenteredContainer>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("react"));
