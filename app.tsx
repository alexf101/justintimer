import * as React from "react";
import * as ReactDOM from "react-dom";
import { Stopwatch, Timer } from "./components/stopwatch";
import { Textbox } from "./components/textbox";
import { YouTube } from "./components/youtube";

const App = () => (
    <div>
        <Timer />
        <Stopwatch />
        <Textbox />
        <YouTube />
    </div>
);

ReactDOM.render(<App />, document.getElementById("react"));
