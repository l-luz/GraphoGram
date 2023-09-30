import React, { Component } from "react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { defaultLang } from "@excalidraw/excalidraw";

import './paginas.css';

defaultLang.code = "pt-PT";


const Diagrama = () => {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                <div
                    style={{
                        height: "500px",
                        width: "900px",
                        border: "1px solid #179487",
                        margin: "0 1rem",
                        padding: "0 1rem"
                    }}
                    className="custom-styles">
                    <Excalidraw>
                        <MainMenu>
                            <MainMenu.ItemLink href="https://google.com">
                                Google
                            </MainMenu.ItemLink>
                            <MainMenu.ItemLink href="https://excalidraw.com">
                                Excalidraw
                            </MainMenu.ItemLink>
                        </MainMenu>
                    </Excalidraw>
                </div>
            </div>
        </div>
    );
};

export default Diagrama;
