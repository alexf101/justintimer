import React from "react";
import styled from "styled-components";

export const StartStopButton = ({
    running,
    onClick,
}: {
    running: boolean;
    onClick: () => void;
}) => {
    const text = running ? "Stop" : "Start";
    return (
        <Button color={running ? "#f00" : "#0edb0e"} onClick={onClick}>
            {text}
        </Button>
    );
};

interface Props {
    color?: string;
}
export const Button = styled.button<Props>`
    padding: 4px;
    border-radius: 4px;
    font-size: 20px;
    background: ${(props) => (props.color ? props.color : "white")};
`;

export const ClearButton = Button;

export const SingleColumnDisplay = styled.div`
    width: 560px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const RowDisplayWithEvenSpacing = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    > * {
        flex: 1 0 0;
        max-width: 100px;
    }
`;

export const Wrap = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 32px;
`;

export const PaddedCenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px;
`;

export const SideBySide = styled.div`
    display: flex;
`;
