import React, { Component } from 'react';
import { Grid, Button } from '@mui/material';
import '../paginas.css';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import ToggleButtons from "./toogleButtons";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import DiagramaManager from './diagrama';
import ModalInteracao from './modalInteracao';

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
            viewMode: false,
            NodeOptions: [{ obj: true, id: "Novo Nó" }],
            isDialogoOpen: false,
            activeItem: {
                pergunta: '',
                respostas: [{ texto: "", IDNo: "", label: "", readOnly: false }],
            },
        };
    }


    atualizarEtapaAtual = (novoValor) => {
        const { cy, etapaAtual, excalidrawApi, viewMode } = this.state;
        const novoValorID = novoValor.id();
        const elements = excalidrawApi.getSceneElements(); // array
        const noAtual = cy.$("#" + etapaAtual);
        const transicao = novoValor.incomers(function (ele) {
            if (ele.data('transicao')) {
                return ele.isEdge();
            }
        }); // edges array

        noAtual.data("elements", elements);
        noAtual.toggleClass("atual");

        this.setState({ etapaAtual: novoValorID });
        novoValor.toggleClass("atual");

        var sceneData = novoValor.data("elements");

        if (transicao.length > 0) {
            const addedIds = {};
            transicao.forEach((ele) => { // remover duplicatas
                const sourceElements = cy.$(ele.source()).data("elements");
                if (sourceElements) {
                    sceneData.forEach((element) => {
                        addedIds[element.id] = true;
                    });

                    sourceElements.forEach((element) => {
                        if (!addedIds[element.id] && !sceneData[element.id]) {
                            console.log("ids")

                            console.log(element.id)
                            console.log(addedIds)

                            sceneData.push(element);
                            addedIds[element.id] = true;
                        }
                    });
                }
            });
        }
        console.log("el")
        console.log(elements);
        console.log('sc')
        console.log(sceneData);

        const appState = excalidrawApi.getAppState()

        if (viewMode && cy.$("#" + novoValorID).data("label") === '?') {
            // aplicar modal de interação
            this.setState({ isDialogoOpen: true });
        }

        if (sceneData.length === 0) {
            excalidrawApi.resetScene();
        }
        excalidrawApi.updateScene({ elements: sceneData, appState: appState });

        // excalidrawApi.setToast({ message: "teste", closable:false, duration: Infinity});

    };

    incrementaCountEtapas = (soma = 1) => {
        this.setState({ countEtapas: this.state.countEtapas + soma });
        return this.state.countEtapas;
    }

    incrementaCountPergs = (soma = 1) => {
        this.setState({ countPerg: this.state.countPerg + soma });
        return this.state.countPerg;
    }

    proximoNo = () => {

        const { etapaAtual, cy } = this.state;
        const noAtual = cy.$("#" + etapaAtual);
        const vizinhos = noAtual.outgoers(function (ele) {
            return ele.isNode();
        });

        if (vizinhos.length != 0) {
            const proxNo = vizinhos[0];
            this.atualizarEtapaAtual(proxNo);
        } else {
            const etapas = this.incrementaCountEtapas();
            const novoNo = 'node' + etapas;
            cy.add({
                group: 'nodes',
                data: { id: novoNo, label: etapas, elements: [] },
            });

            cy.add({
                group: 'edges',
                data: { source: noAtual.id(), target: novoNo, transicao: false },
            });
            cy.layout({
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            }).run();
        }
    }

    noAnterior = () => {
        const { etapaAtual, cy } = this.state;
        const vizinhos = cy.$("#" + etapaAtual).incomers(function (ele) {
            return ele.isNode();
        });

        if (vizinhos.length != 0) {
            const noAnt = vizinhos[0];
            this.atualizarEtapaAtual(noAnt);
        }
    }

    componentDidMount() {
        Cytoscape.use(dagre);

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
                },
                {
                    selector: '.modify',
                    style: {
                        'border-width': 3,
                        'line-color': '#18ffff',
                        'background-color': '#18ffff',
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
        this.setState({ cy: cy });

        cy.on('select', 'node', (event) => {
            const ele = event.target;
            if (ele.isNode()) {
                this.atualizarEtapaAtual(ele);
            }
        });
    }

    setExcalidrawApi = (api) => {
        this.setState({ excalidrawApi: api });
    }

    toggleViewMode = () => {
        this.setState({ viewMode: !this.state.viewMode });
    }
    getNodeIDs = () => {
        const { cy } = this.state;
        const nos = [];
        nos.push({ obj: true, id: "novoNo", label: "Novo Nó" });

        cy.nodes().forEach(ele => {
            if (ele.data("label") !== '?') {
                const no = {
                    id: ele.data("id"),
                    obj: ele,
                    label: ele.data("label")
                }
                nos.push(no);
            }
        });

        this.setState({ NodeOptions: nos, modal: !this.state.modal });
    };


    render() {
        const { cy, viewMode, etapaAtual, NodeOptions } = this.state;
        return (
            <Grid container spacing={1} style={{ height: '85vh' }}>
                <Grid item xs={3} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <ToggleButtons
                            cy={cy}
                            incrementaCountEtapas={this.incrementaCountEtapas}
                            incrementaCountPergs={this.incrementaCountPergs}
                            getNodeIDs={this.getNodeIDs}
                            NodeOptions={NodeOptions}
                        />
                        <CytoscapeComponent
                            id="cy"
                            style={{ flex: 1 }}
                        />
                    </div>

                    <Grid container spacing={8} style={{ justifyContent: 'flex-start', paddingTop: '1rem', marginBottom: '2rem' }}>
                        <Grid item xs={6} >
                            <Button style={{ color: "#00695c" }} onClick={this.noAnterior}>
                                <FaArrowLeft size={42} />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button style={{ color: "#00695c" }} onClick={this.proximoNo}>
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
                        <DiagramaManager etapaAtual={etapaAtual} viewMode={viewMode} toggleViewMode={this.toggleViewMode} setExcalidrawApi={this.setExcalidrawApi} />
                        {this.state.isDialogoOpen && (
                            <ModalInteracao
                                activeItem={this.state.activeItem}
                                toggle={this.state.isDialogoOpen}
                                onSave={this.handleDialogoSubmit}
                                nodes={NodeOptions}
                            />
                        )}
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default Diagrama;
