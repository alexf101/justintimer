import * as React from "react";
import * as ReactDOM from "react-dom";
import { Stopwatch } from "./components/stopwatch";

const App = () => <Stopwatch />;

ReactDOM.render(<App />, document.getElementById("react"));
