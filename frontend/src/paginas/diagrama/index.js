import React, { Component } from 'react';
import { Excalidraw, MainMenu, defaultLang } from "@excalidraw/excalidraw";
import {Grid, Button} from '@mui/material';
import '../paginas.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import ToggleButtons from "./toogleButtons";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { teal } from '@mui/material/colors';

const GRAPH_WIDTH = 400;
var node1 = "node1";
defaultLang.code = "pt-PT";

class Diagrama extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            modal: false,
            cy: null,
            countEtapas: 3,
            countPerg: 0,
            etapaAtual: node1
        };
    }

    incrementaCountEtapas = (soma = 1) => {
        this.setState({ countEtapas: this.state.countEtapas + soma });
        return this.state.countEtapas;
    }
    incrementaCountPergs = () => {
        this.setState({ countPerg: this.state.countPerg + 1 });
        return this.state.countPerg;
    }

    proximoNo = () => {
        const {etapaAtual, cy} = this.state;
        const vizinhos = cy.$("#" + etapaAtual).outgoers(function (ele) {
            return ele.isNode();
        });

        if (vizinhos.length != 0){
            cy.$("#"+etapaAtual).removeClass("atual");
            const proxNo = vizinhos[0].id();
            this.setState({etapaAtual: proxNo});
            cy.$("#" + proxNo).addClass("atual");

    
        }

    }
    
    noAnterior  = () => {
        const {etapaAtual, cy} = this.state;
        const vizinhos = cy.$("#" + etapaAtual).incomers(function (ele) {
            return ele.isNode();
        });
        
        if (vizinhos.length != 0){
            cy.$("#" + etapaAtual).removeClass("atual");
            const noAnt = vizinhos[0].id();
            this.setState({etapaAtual: noAnt});
            cy.$("#" + noAnt).addClass("atual");
        }
    }


    componentDidMount() {
        Cytoscape.use(dagre);

        const cy = Cytoscape({
            container: document.getElementById('cy'),
            elements: {
                nodes: [
                    { classes: 'atual', data: { id: node1, label: '1' }, selected: true, position: { x: GRAPH_WIDTH / 2, y: 30 } },
                    { data: { id: 'node2', label: '2' }, position: { x: GRAPH_WIDTH / 2, y: 30 } },
                ],
                edges: [
                    {
                        data: { source: 'node1', target: 'node2' }
                    }
                ]
            },
            classes: ['atual'],
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)', // Mostra o rótulo do nó
                        'text-valign': 'center',
                        'background-color': '#D9D9D9',
                        'color': "#FC7878",
                        'font-weight': 'bold',
                    },

                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#404040',
                        'target-arrow-color': '#404040',
                        'target-arrow-shape': 'chevron',
                        'curve-style': 'bezier',
                    }
                },
                {
                    selector: '.atual',
                    style: {
                        'border-width': 3,
                        'border-color': '#FC7878' // Cor da borda
                    }
                }
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
        this.setState({ cy: cy });
        cy.on('select', 'node', (event) => {
            const {etapaAtual} = this.state;
            const ele = event.target; // Obtém o nó selecionado
            if (ele.isNode()){
                cy.$("#"+etapaAtual).removeClass("atual");
                ele.addClass("atual");
                console.log('Nó selecionado:', ele.id()); // Imprime o ID do nó selecionado    
                this.setState({ etapaAtual: ele.id() });
            }
        });
        

        
    }

    render() {
        const { cy } = this.state;
        return (
            <Grid container spacing={1} style={{ height: '85vh' }}>
                <Grid item xs={3} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <ToggleButtons cy={cy}
                            incrementaCountEtapas={this.incrementaCountEtapas}
                            incrementaCountPergs={this.incrementaCountPergs}
                        />
                        <CytoscapeComponent
                            id="cy"
                            style={{ flex: 1 }}
                        />
                    </div>

                    <Grid container spacing={8} style={{justifyContent: 'flex-start', paddingTop: '1rem', marginBottom:'2rem' }}>
                        <Grid item xs={6} >
                            <Button style={{color:"#00695c"}} onClick={this.noAnterior}>
                                <FaArrowLeft size={42} />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button style={{color:"#00695c"}} onClick={this.proximoNo}>
                                <FaArrowRight size={42} />
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>

                <Grid item xs={9} style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
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
