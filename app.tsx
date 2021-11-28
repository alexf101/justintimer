import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { Stopwatch, Timer } from "./components/stopwatch";
import { Textbox } from "./components/textbox";
import { YouTube } from "./components/youtube";

const TimerChooser = () => {
    return (
        <TimerNavBar>
            <a href="#timer">Stopwatch</a>
            <a href="#timer">Timer</a>
            <a href="#timer">Tabata</a>
        </TimerNavBar>
    );
};
const TimerNavBar = styled.div`
    margin: 8px auto;
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
            {page}
            <TimerChooser />
            <Timer />
            <Stopwatch />
            <Textbox />
            <YouTube />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("react"));
