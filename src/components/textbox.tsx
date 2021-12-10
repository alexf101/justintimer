import React, { createRef, useEffect } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup, buildMenuItems } from "prosemirror-example-setup";
import "prosemirror-menu/style/menu.css";
import styled from "styled-components";

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: (addListNodes(schema.spec.nodes, "paragraph block*", "block") as any)
        .remove("image")
        .remove("blockquote")
        .remove("heading")
        .remove("code_block")
        .remove("horizontal_rule"),
    marks: (schema.spec.marks as any).remove("link").remove("code"),
});
// See here for what this returns: https://github.com/ProseMirror/prosemirror-example-setup/blob/06111da08f4aa58b96e52ad4bfba32b1d3ad6fbe/src/menu.js.
const myMenu: any[] = buildMenuItems(mySchema).fullMenu;
// Get rid of drop-down menu for headers, I don't want it
myMenu.splice(1, 1);
// Get rid of the "select parent node" menu item, I don't want that either.
myMenu[2].splice(4, 1);

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
                plugins: exampleSetup({
                    schema: mySchema,
                    menuContent: myMenu,
                }),
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
    width: 453px;
    border-radius: 8px;
    border: 2px solid gray;
    font-size: 1.6rem;
    overflow: hidden;
    .ProseMirror {
        height: 360px;
        overflow: auto;
        padding: 0 12px;
        font-family: sans-serif;
    }
`;
