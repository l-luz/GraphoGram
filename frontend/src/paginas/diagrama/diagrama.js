import { Component } from "react";
import { Excalidraw, MainMenu, defaultLang } from "@excalidraw/excalidraw";

defaultLang.code = "pt-PT";
window.EXCALIDRAW_ASSET_PATH = "/";

class DiagramaManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            etapaId: 'node0',
        };
    }

    handleOnChange = (excalidrawElements, appState, files) => {
        // const { cy, etapas, etapaAtual, excalidrawApi, setAtualElements } = this.props;
        // const {etapaId} = this.state;
        // console.log("aqui")
        // const atual = cy.nodes(".atual")[0];

        // console.log("eid " + etapaId + " x  " + "atual " + etapaAtual );
        // console.log("onchange")
        // console.log(atual.data('elements'))
        // console.log(excalidrawElements);
        // console.log(appState);
        // console.log(files);
    }

    render() {
        const {setExcalidrawApi} = this.props;
        return (
            <Excalidraw onChange={this.handleOnChange} ref={(api) => {setExcalidrawApi(api)}  } >
                <MainMenu>
                    <MainMenu.Item onSelect={() => window.alert("Item1")}>
                        Item1
                    </MainMenu.Item>
                    <MainMenu.Item onSelect={() => window.alert("Item2")}>
                        Item 2
                    </MainMenu.Item>
                </MainMenu>
            </Excalidraw>
        );
    };
}

export default DiagramaManager;