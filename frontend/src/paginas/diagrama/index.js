import React, { Component } from 'react';
import { Excalidraw, MainMenu, defaultLang } from "@excalidraw/excalidraw";
import Grid from '@mui/material/Grid';
import '../paginas.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import ToggleButtons from "./toogleButtons";

const GRAPH_WIDTH = 400;

defaultLang.code = "pt-PT";

class Diagrama extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            modal: false,
            cy: null,
            nos: 3,
            perguntas: 0,
        };
    }

    incrementaEtapas = () => {
        this.setState({ nos: this.state.nos + 1 });
        return this.state.nos;
    }
    incrementaPerguntas = () => {
        this.setState({ nos: this.state.perguntas + 1 });
        return this.state.perguntas;
    }

    


    componentDidMount() {
        Cytoscape.use(dagre);
        console.log(dagre); // ou console.log(Cytoscape.use(dagre)); dependendo de como você está importando

        const cy = Cytoscape({
            container: document.getElementById('cy'),
            elements: {
                nodes: [
                    { data: { id: 'node1', label: '1' }, position: { x: GRAPH_WIDTH / 2, y: 30 } },
                    { data: { id: 'node2', label: '2' }, position: { x: GRAPH_WIDTH / 2, y: 30  } },
                ],
                edges: [
                    {
                        data: { source: 'node1', target: 'node2' }
                    }
                ]
            },
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)', // Mostra o rótulo do nó
                        'text-valign': 'center', 
                        'background-color': '#ccc',                
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#404040',
                        'target-arrow-color': '#404040',
                        'target-arrow-shape': 'chevron',
                        'curve-style': 'bezier'
                    }
                },

            ],
            layout: {
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            },
        });
        cy.zoom(0.75);
        // cy.selectionType( 'additive' );
        // cy.boxSelectionEnabled(true);
        // cy.autolock( true );
        // cy.autounselectify( false );
        this.setState({cy: cy});
    }
    
    render() {
        const {cy} = this.state;
        return (
            <Grid container spacing={30}>
                <Grid item xs={3}>
                    <div>
                        <ToggleButtons cy={cy}
                            incrementaEtapas={this.incrementaEtapas}
                            incrementaPerguntas={this.incrementaPerguntas}
                        />
                        <CytoscapeComponent
                            id="cy"
                            
                            style={{ width: GRAPH_WIDTH, height: '400px' }}
                        />
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div
                        style={{
                            height: "499px",
                            border: "1px solid #179487",
                            margin: "0 1rem",
                            // padding: "0 1rem"
                        }}
                        className="custom-styles">
                        <Excalidraw>
                            <MainMenu>
                                <MainMenu.Item onSelect={() => window.alert("Item1")}>
                                    Item1
                                </MainMenu.Item>
                                <MainMenu.Item onSelect={() => window.alert("Item2")}>
                                    Item 2
                                </MainMenu.Item>
                            </MainMenu>
                        </Excalidraw>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default Diagrama;
