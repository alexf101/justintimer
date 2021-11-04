import React, { createRef, useEffect } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import "prosemirror-menu/style/menu.css";
import styled from "styled-components";

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: (addListNodes(schema.spec.nodes, "paragraph block*", "block") as any)
        .remove("image")
        .remove("horizontal_rule"),
    marks: (schema.spec.marks as any).remove("link"),
});

export const Textbox = () => {
    const toolbarRef = createRef<HTMLDivElement>();
    const editorRef = createRef<HTMLDivElement>();
    useEffect(() => {
        if (!editorRef.current || !toolbarRef.current) {
            return;
        }

        const view = new EditorView(editorRef.current, {
            state: EditorState.create({
                schema: mySchema,
                plugins: exampleSetup({ schema: mySchema }),
            }),
        });
    }, []);
    return (
        <div>
            <div id="editor-toolbar" ref={toolbarRef} />
            <EditorWrapper ref={editorRef} id="wod-editor" />
        </div>
    );
};

const EditorWrapper = styled.div`
    margin: 0 auto;
    width: 560px;
    padding: 8px;
    border-radius: 8px;
    border: 2px solid gray;
    font-size: 20px;
    overflow: hidden;
    .ProseMirror {
        height: 360px;
        overflow: auto;
    }
`;
