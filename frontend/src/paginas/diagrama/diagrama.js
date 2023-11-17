import { Component } from "react";
import { Excalidraw, MainMenu, defaultLang, WelcomeScreen, Footer } from "@excalidraw/excalidraw";

defaultLang.code = "pt-PT";

class DiagramaManager extends Component {
  constructor(props) {
    super(props);
  }

    render() {
        const {setExcalidrawApi, viewMode} = this.props;
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

          className="custom-styles">

            <Excalidraw 
                viewModeEnabled={viewMode} 
                ref={(api) => {setExcalidrawApi(api)}}
            >
            </Excalidraw>
            </div>
        );
    };
}


export default DiagramaManager;