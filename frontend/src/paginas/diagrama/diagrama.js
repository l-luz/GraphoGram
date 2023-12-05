import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { defaultLang } from "@excalidraw/excalidraw";

defaultLang.code = "pt-PT";


const DiagramaManager = ({ setExcalidrawApi, viewMode }) => {
    return (
        <div
            style={{
                height: '95%',
                width: '100%',
                border: '1px solid #179487',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: "0 1rem",
            }}
            className="custom-styles"
        >
            <Excalidraw
                viewModeEnabled={viewMode}
                ref={(api) => { setExcalidrawApi(api) }}
            />
        </div>
    );
};

export default DiagramaManager;