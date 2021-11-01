import * as React from "react";
import * as ReactDOM from "react-dom";

const Greet = () => <h1>Hello, world!</h1>;
const App = () => <Greet />;

ReactDOM.render(<App />, document.getElementById("react"));
