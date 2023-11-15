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
          <>
            <Excalidraw 
                viewModeEnabled={viewMode} 
                ref={(api) => {setExcalidrawApi(api)}}
            >
            </Excalidraw>
            </>
        );
    };
}


export default DiagramaManager;