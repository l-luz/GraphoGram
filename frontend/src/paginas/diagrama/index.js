import React, { Component } from 'react';
import {Grid, Button} from '@mui/material';
import '../paginas.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import ToggleButtons from "./toogleButtons";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import DiagramaManager from './diagrama';

const GRAPH_WIDTH = 400;
var initialNode = "node0";

class Diagrama extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            modal: false,
            cy: null,
            countEtapas: 1,
            countPerg: 0,
            etapaAtual: initialNode,
            excalidrawApi: null,
        };
    }

    atualizarEtapaAtual = (novoValor) => {
        const { cy, etapaAtual, excalidrawApi } = this.state;
        const novoValorID = novoValor.id();
        const elements = excalidrawApi.getSceneElements();
        
        cy.$("#" + etapaAtual).data("elements", elements);
        cy.$("#" + etapaAtual).removeClass("atual");

        this.setState({ etapaAtual: novoValorID });
        cy.$("#" + novoValorID).addClass("atual");

        const sceneData = novoValor.data("elements");

        const a = {
            elements: [
                {
                    type: "rectangle",
                    version: 141,
                    versionNonce: 361174001,
                    isDeleted: false,
                    id: "oDVXy8D6rom3H1-LLH2-f",
                    fillStyle: "hachure",
                    strokeWidth: 1,
                    strokeStyle: "solid",
                    roughness: 1,
                    opacity: 100,
                    angle: 0,
                    x: 100.50390625,
                    y: 93.67578125,
                    strokeColor: "#c92a2a",
                    backgroundColor: "transparent",
                    width: 186.47265625,
                    height: 141.9765625,
                    seed: 1968410350,
                    groupIds: [],
                    boundElements: null,
                    locked: false,
                    link: null,
                    updated: 1,
                    roundness: {
                        type: 3,
                        value: 32,
                    },
                },
            ],
        };
        // excalidrawApi.updateScene(a);
        // console.log(a)
        // const b  = {elements: excalidrawApi.getSceneElements()}
        // console.log(b)
        // console.log('att')
        // console.log(typeof(elements))
        // console.log(elements )
        // console.log(typeof(cy.$("#" + etapaAtual).data("elements")))
        // console.log(cy.$("#" + etapaAtual).data("elements"));
        // console.log(typeof(sceneData))
        // console.log(sceneData)
        if (sceneData.length === 0){
            excalidrawApi.resetScene();
        }
            excalidrawApi.updateScene({elements: sceneData});
    };

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
            const proxNo = vizinhos[0];
            this.atualizarEtapaAtual(proxNo);
        }
        console.log("etapas " + this.state.countEtapas + " " + " perguntas " + this.state.countPerg + "atual " + etapaAtual)
    }

    noAnterior  = () => {
        const {etapaAtual, cy} = this.state;
        const vizinhos = cy.$("#" + etapaAtual).incomers(function (ele) {
            return ele.isNode();
        });
        
        if (vizinhos.length != 0){
            const noAnt = vizinhos[0];
            this.atualizarEtapaAtual(noAnt);
        }
        console.log("etapas " + this.state.countEtapas + " " + " perguntas " + this.state.countPerg + "atual " + etapaAtual)
    }

    componentDidMount() {
        Cytoscape.use( dagre );

        const cy = Cytoscape({
            container: document.getElementById('cy'),
            elements: {
                nodes: [
                    { classes: 'atual', data: { id: initialNode, label: '0', elements: [] }, selected: true, position: { x: GRAPH_WIDTH / 2, y: 30 } },
                ],
            },
            classes: ['atual'],
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
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
                        'border-color': '#FC7878'
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
        this.setState({ cy: cy });
        
        cy.on('select', 'node', (event) => {
            const ele = event.target;
            if (ele.isNode()){
                this.atualizarEtapaAtual(ele);
            }
        });
    }

    setExcalidrawApi = (api) => {
        this.setState({excalidrawApi: api});
    }
    
    render() {
        const { cy, countEtapas, etapaAtual } = this.state;
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
                            <DiagramaManager cy={cy} etapaAtual={etapaAtual} etapas={countEtapas} setExcalidrawApi={this.setExcalidrawApi} />
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default Diagrama;
