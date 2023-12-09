import React from 'react';
import { Excalidraw, defaultLang } from '@excalidraw/excalidraw';
import './paginas.css';

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