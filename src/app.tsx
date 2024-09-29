import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Stopwatch } from "./pages/stopwatch";
import { Tabata } from "./pages/tabata";
import { Timer } from "./pages/timer";
import { Howl } from "howler";
import { DualTimer } from "./pages/dual-timer";
import { PaddedCenteredContainer } from "./components/shared_ui";

/* This segment is copy/pasted from the Firebase setup.

We're not actually using Firebase for anything other than hosting; however I've dropped this here
as they suggest during setup in case it becomes useful and to turn on analytics - maybe it'll be interesting?
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAbgshBlQIHtoD-b7EUlYrW6mkXDUzTGM",
    authDomain: "justintimer-ecdde.firebaseapp.com",
    projectId: "justintimer-ecdde",
    storageBucket: "justintimer-ecdde.appspot.com",
    messagingSenderId: "935897448070",
    appId: "1:935897448070:web:a9bc8db7479ce9611fdb07",
    measurementId: "G-HWTD6R83Z8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/* End copy/pasted Firebase setup */


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
            <GlobalStyles />
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

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }
`;

ReactDOM.render(<App />, document.getElementById("react"));
