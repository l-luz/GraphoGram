import { Component } from "react";
import { Excalidraw, MainMenu, defaultLang, WelcomeScreen, Footer } from "@excalidraw/excalidraw";

defaultLang.code = "pt-PT";

class DiagramaManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            etapaId: 'node0',
            viewMode: false
        };
    }

    
    render() {
        const {setExcalidrawApi, toggleViewMode, viewMode} = this.props;
        return (
            <Excalidraw onChange={this.handleOnChange} viewModeEnabled={viewMode} ref={(api) => {setExcalidrawApi(api)}} 
            
            renderTopRightUI={() => {
                return (
                  <button
                    style={{
                      background: "#70b1ec",
                      border: "none",
                      color: "#fff",
                      width: "max-content",
                      fontWeight: "bold",
                    }}
                    onClick={() => {toggleViewMode() }}
                  >
                    Apresentação
                  </button>
                );
              }}
            >
      
                {/* <MainMenu>
                    <MainMenu.Item onSelect={() => window.alert("Item1")}>
                        Item1
                    </MainMenu.Item>
                    <MainMenu.Item onSelect={() => window.alert("Item2")}>
                        Item 2
                    </MainMenu.Item>
                </MainMenu> */}
                <Footer>
        </Footer>
            </Excalidraw>
        );
    };
}

export default DiagramaManager;