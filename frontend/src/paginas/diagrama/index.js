import React, { Component } from 'react';
import axios from "axios";
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from "cytoscape-dagre";
import {
    Grid,
    Button, IconButton, ToggleButton,
    TextField, Typography,
    Snackbar, Alert,
} from '@mui/material';
import {
    FaArrowLeft, FaArrowRight,
    FaInfoCircle
} from "react-icons/fa"
import DiagramaManager from './diagrama';
import ToggleButtons from "./toogleButtons";
import ModalInteracao from './modalInteracao';

import edgehandles from 'cytoscape-edgehandles';

function Copyright(props) {
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" align="justify" {...props}>
                        {'Copyright © '} 2016-2023, The Cytoscape Consortium.
                    </Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="body2" color="text.secondary" align="justify" {...props}>
                        {'Copyright © '} 2020 Excalidraw
                    </Typography>

                </Grid>
            </Grid>
        </>
    );
}

let initialNode = "node1";
Cytoscape.use(dagre);
Cytoscape.use(edgehandles);


class Diagrama extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            eh: null,
            excalidrawApi: null,
            countEtapas: 1,
            countPerg: 0,
            etapaAtual: "",
            NodeOptions: [{ obj: true, id: "Novo Nó" }],
            isInteracaoOpen: false,
            viewMode: false,
            presentationMode: false,
            diagramaInfo: {
                titulo: '',
                descricao: '',
            },
            pageID: "",
            saved: false,
            showDescricao: false
        };
    }
    recuperaElementos = (cy) => {
        const { excalidrawApi } = this.state;
        const noAtual = cy.$(".atual");
        excalidrawApi.updateScene({ elements: noAtual.data("elements"), appState: excalidrawApi.getAppState() });
    }

    atualizaEtapaApresentacao = (novoValor) => {
        const { cy, etapaAtual, excalidrawApi, viewMode, pageID, presentationMode } = this.state;
        console.log("atualizar etapa apresentacao")
        let novoValorID;
        try {
            novoValorID = novoValor.id();

        } catch (e) {
            novoValor = cy.$('#' + novoValor);
            novoValorID = novoValor.id();
        }

        const noAtual = cy.$("#" + etapaAtual);
        const transicao = novoValor.incomers(function (ele) {
            // recupera as transições para aplicar os efeitos
            if (ele.hasClass('acumular')) {
                return ele.isEdge();
            }
        }); // edges array

        noAtual.toggleClass("atual", false);
        novoValor.toggleClass("atual", true);

        let sceneData = novoValor.data("elements"); // recupera elementos do novo nó

        if (transicao.length > 0) { // recupera transições a serem aplicadas
            const addedIds = {};
            transicao.forEach((ele) => { // remove duplicatas
                const sourceElements = cy.$(ele.source()).data("elements");
                if (sourceElements) {
                    sceneData.forEach((element) => {
                        addedIds[element.id] = true;
                    });

                    sourceElements.forEach((element) => {
                        if (!addedIds[element.id] && !sceneData[element.id]) {
                            sceneData.push(element);
                            addedIds[element.id] = true;
                        }
                    });
                }
            });
        }

        const appState = excalidrawApi.getAppState();
        if (novoValor.data("label") === '?' && (viewMode, presentationMode)) {
            this.setState({ isInteracaoOpen: !this.state.isInteracaoOpen });
        }

        if (!sceneData || sceneData.length === 0) {
            excalidrawApi.resetScene();
        }
        cy.fit(novoValor, 100);
        excalidrawApi.updateScene({ elements: sceneData, appState: appState });
        excalidrawApi.setToast({ message: "Slide " + novoValor.data("label"), closable: true, duration: Infinity });
        this.setState({ etapaAtual: novoValorID });
    }

    atualizarEtapaAtual = (novoValor) => {
        const { cy, etapaAtual, excalidrawApi, viewMode, pageID } = this.state;
        let novoValorID;
        console.log("atualizar etapa atual")
        try {
            novoValorID = novoValor.id();
        } catch (e) {
            novoValor = cy.$('#' + novoValor);
            novoValorID = novoValor.id();
        }

        if (pageID) {
            this.recuperaElementos(cy);
        }
        const elements = excalidrawApi.getSceneElements(); // array
        
        const noAntigo = cy.$("#" + etapaAtual);

        const transicao = novoValor.incomers(function (ele) {
            // recupera as transições para aplicar os efeitos
            if (ele.hasClass('acumular')) {
                return ele.isEdge();
            }
        }); // edges array
        // atualiza o no atual

        noAntigo.data("elements", elements);
        noAntigo.toggleClass("atual", false);
        novoValor.toggleClass("atual", true);

        let sceneData = novoValor.data("elements"); // recupera elementos do novo nó

        if (transicao.length > 0) { // recupera transições a serem aplicadas
            const addedIds = {};
            transicao.forEach((ele) => { // remove duplicatas
                const sourceElements = cy.$(ele.source()).data("elements");
                if (sourceElements) {
                    sceneData.forEach((element) => {
                        addedIds[element.id] = true;
                    });

                    sourceElements.forEach((element) => {
                        if (!addedIds[element.id] && !sceneData[element.id]) {
                            sceneData.push(element);
                            addedIds[element.id] = true;
                        }
                    });
                }
            });
        }

        const appState = excalidrawApi.getAppState();

        let textAux = '';
        if (novoValor.data("label") === '?') {
            if (viewMode) {
                this.setState({ isInteracaoOpen: !this.state.isInteracaoOpen });
            }
            textAux = "\n" + novoValor.data('pergunta').slice(0, 30) + "...";
        }

        if (!sceneData || sceneData.length === 0) {
            excalidrawApi.resetScene();
        }
        cy.fit(novoValor, 100);
        excalidrawApi.updateScene({ elements: sceneData, appState: appState });
        excalidrawApi.setToast({ message: "Slide " + novoValor.data("label") + textAux, closable: true, duration: Infinity });
        this.setState({ etapaAtual: novoValorID });

    };

    incrementaCountEtapas = (soma = 1) => {
        this.setState({ countEtapas: this.state.countEtapas + soma });
        return this.state.countEtapas + soma;
    }

    incrementaCountPergs = (soma = 1) => {
        this.setState({ countPerg: this.state.countPerg + soma });
        return this.state.countPerg;
    }

    proximoNo = (proxNo = null) => {
        const { etapaAtual, cy, viewMode, presentationMode } = this.state;
        console.log("proxno")
        if (proxNo === 'del') { // caso delete, recupera um nó aleatório
            proxNo = cy.nodes()[0].id();

            if (!proxNo) {
                proxNo = null;
            }
        }
        if (proxNo !== null) { //  recupera o nó seguinte
            proxNo = cy.$('#' + proxNo);
        }
        else { // novo nó ou prox qualquer
            const noAtual = cy.$("#" + etapaAtual);
            const vizinhos = noAtual.outgoers(function (ele) {
                return ele.isNode();
            });
            if (vizinhos.length !== 0) {
                try {
                    const resp_id = noAtual.data("caminho");
                    proxNo = noAtual.data("respostas")[resp_id].IDNo;
                } catch {
                    proxNo = vizinhos[0];
                }

            } else if (!viewMode && !presentationMode) { // criar novo nó no modo de edicao
                const etapas = this.incrementaCountEtapas();
                const novoNo = 'node' + etapas;
                cy.add({
                    group: 'nodes',
                    data: { id: novoNo, label: etapas, elements: [] },
                });
                if (noAtual.isNode()) {
                    cy.add({
                        group: 'edges',
                        data: { source: noAtual.id(), target: novoNo },
                        classes: ["acumular"]
                    });
                    cy.layout({
                        name: "dagre",
                        padding: 24,
                        spacingFactor: 1.5
                    }).run();
                }
                console.log(novoNo)
                proxNo = cy.$('#' + novoNo);
            }
        }
        if (proxNo) {
            if (presentationMode || viewMode) {
                this.atualizaEtapaApresentacao(proxNo)
            }
            else {
                this.atualizarEtapaAtual(proxNo);
            }
        }
    }

    noAnterior = () => {
        const { etapaAtual, cy, presentationMode, viewMode } = this.state;
        const vizinhos = cy.$("#" + etapaAtual).incomers(function (ele) {
            return ele.isNode();
        });

        if (vizinhos.length !== 0) {
            const noAnt = vizinhos[0];
            if (presentationMode || viewMode) {
                this.atualizaEtapaApresentacao(noAnt)
            } else {
                this.atualizarEtapaAtual(noAnt);

            }
        }
    }
    
    setCytoscape = async (id) => {
        const { cy, countEtapas } = this.state;
        let newCy;

        if (!cy) {
            console.log("not cy")
            newCy = Cytoscape({
                container: document.getElementById('cy'),
                classes: ['atual', 'modify', 'pergunta', 'acumular'],
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
                            'line-color': '#598ca6',
                            'target-arrow-color': '#598ca6',
                            'target-arrow-shape': 'triangle-cross',
                            'curve-style': 'bezier',
                        }
                    },
                    {
                        selector: '.acumular',
                        style: {
                            'width': 3,
                            'line-color': '#404040',
                            'target-arrow-color': '#404040',
                            'target-arrow-shape': 'triangle' ,
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
                    {
                        selector: '.pergunta',
                        style: {
                            'shape': 'round-diamond',
                        }
                    }
                ],
            });

        } else {
            newCy = cy;
        }

        if (id === '') { // modo de edição do diagrama
            newCy.add({
                group: 'nodes',
                classes: 'atual',
                data: { id: initialNode, label: countEtapas, elements: [] },
                selected: true,
            },);

            this.setState({ etapaAtual: initialNode });
            newCy.layout({
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            }).run();

        } else { // recuperar diagrama existente
            console.log("rec")
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
            await axios
                .get(`/api/diagramas/${id}/`)
                .then((res) => {
                    console.log("diagrama!")
                    newCy.json(res.data.etapas);

                    this.setState({
                        cy: newCy,
                        etapaAtual: newCy.$(".atual").data("id"),
                        countEtapas: res.data.num_etapas,
                        countPerg: res.data.num_pergs,
                        diagramaInfo: {
                            titulo: res.data.titulo,
                            descricao: res.data.descricao
                        },
                    });
                    this.recuperaElementos(newCy);
                    newCy.fit(newCy.$(".atual").closedNeighborhood(), 100);
                    newCy.layout({
                        name: "dagre",
                        padding: 24,
                        spacingFactor: 1.5
                    }).run();
                }).catch((error) => {
                    console.error('Erro ao recuperar diagrama:', error);
                });
        }


        this.setState({ cy: newCy });
        return newCy;
    }

    async componentDidMount() {
        while (!this.state.excalidrawApi) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const path = window.location.href.split('/');
        let pageId = Number(path[path.length - 1]);
        if (isNaN(pageId)) {
            pageId = '';
        }

        this.setState({ pageID: pageId });

        const cy = await this.setCytoscape(pageId)
        if (!this.state.CytoscapeComponent) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Aguarde 100 milissegundos antes de verificar novamente
        }

        console.log(this.state.cy, this.state.etapaAtual, this.state.countEtapas, this.state.countPerg)

        let defaults = {
            canConnect: function (sourceNode, targetNode) {
                // whether an edge can be created between source and target
                return (
                    sourceNode.id() !== targetNode.id()
                );
            },
            edgeParams: function (sourceNode, targetNode) {
                // for edges between the specified source and target
                // return element object to be passed to cy.add() for edge
                return {};
            },
            hoverDelay: 150, // time spent hovering over a target node before it is considered selected
            snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
            snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
            snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
            noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
            disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
        };

        const eh = cy.edgehandles(defaults);

        this.setState({ cy: cy, eh: eh });

        cy.on('select', 'node', (event) => {
            const ele = event.target;
            if (ele.isNode()) {
                console.log("select event")
                this.atualizarEtapaAtual(ele);
            }
        });
    }

    setExcalidrawApi = (api) => {
        const { cy, etapaAtual, excalidrawApi } = this.state;
        this.setState({ excalidrawApi: api }, () => {

            if (cy && !etapaAtual && excalidrawApi) { // 
                this.setState({ etapaAtual: initialNode });
                console.log("update")
                this.atualizarEtapaAtual(cy.$("#" + initialNode));
            }
        });
    }
    togglePresentationMode = () => {
        const {cy, excalidrawApi} = this.state;
        if (this.state.presentationMode) {
            document.body.removeEventListener('keydown', this.handleKeyDown);
        } else {
            document.body.addEventListener('keydown', this.handleKeyDown);
            excalidrawApi.updateScene({ elements: excalidrawApi.getSceneElements()});    
            
        }
        this.setState({ viewMode: !this.state.presentationMode });
        this.setState({ presentationMode: !this.state.presentationMode });
        console.log(this.state.cy, this.state.etapaAtual, this.state.countEtapas, this.state.countPerg)

    }

    toggleViewMode = () => {
        if (this.state.viewMode || this.state.presentationMode) {
            document.body.removeEventListener('keydown', this.handleKeyDown);
        } else {
            document.body.addEventListener('keydown', this.handleKeyDown);
        }
        this.setState({ viewMode: !this.state.viewMode });
    }

    toggleInteracao = () => {
        this.setState({ isInteracaoOpen: !this.state.isInteracaoOpen });
    }
    toggleDescricao = () => {
        this.setState({ showDescricao: !this.state.showDescricao }) 
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
        this.setState({ NodeOptions: nos });
    };

    salvar = async () => {
        const { cy, excalidrawApi, pageID, countEtapas, countPerg } = this.state;
        const content = {
            etapas: cy.json(),
            estrutura: excalidrawApi.getAppState(),
            titulo: this.state.diagramaInfo.titulo || "Novo Diagrama",
            descricao: this.state.diagramaInfo.descricao,
            num_etapas: countEtapas,
            num_pergs: countPerg,
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        console.log(pageID);
        try {
            if (pageID === "") {
                await axios.post("/api/diagramas/", content);
                console.log("adicionando diagrama");
            } else {
                await axios.put(`/api/diagramas/${pageID}/`, content);
                console.log("atualizando diagrama");
            }
            this.setState({ saved: true });
        }
        catch (e) {
            console.error("Erro ao salvar:", e)
        }
    }
    closeSaveSnack = () => {
        this.setState({ saved: false });
    }

    setItem = (e) => {
        const { diagramaInfo } = this.state;
        let newInfo;
        let tipo  = e.target.name
        if (tipo === "titulo") {
            newInfo = e.target.value
        }else{
            newInfo = e.target.value
        }

        const newItem = { ...diagramaInfo, [tipo]: newInfo };
        this.setState({ diagramaInfo: newItem });
    }

    handleKeyDown = (event) => {
        console.log("interacao:", this.state.isInteracaoOpen)
        if (!this.state.isInteracaoOpen) {
            if (event.key === 'ArrowLeft') {
                this.noAnterior();
            } else if (event.key === 'ArrowRight') {
                this.proximoNo();
            }
        }
    }

    render() {
        const { cy, eh, viewMode, presentationMode, etapaAtual, NodeOptions, diagramaInfo, saved, showDescricao } = this.state;
        return (
            <>
                <Snackbar open={saved} autoHideDuration={6000} onClose={this.closeSaveSnack}>
                    <Alert onClose={this.closeSaveSnack} severity="success" sx={{ width: '100%' }}>
                        Diagrama Salvo!
                    </Alert>
                </Snackbar>

                {presentationMode ?
                    <Grid container spacing={1} style={{ height: '85vh' }}>
                        <DiagramaManager
                            etapaAtual={etapaAtual} viewMode={viewMode}
                            setExcalidrawApi={this.setExcalidrawApi}
                        />
                        <Grid item xs={3}>
                            <Button variant="outlined"
                                onClick={() => { this.togglePresentationMode() }}>
                                Sair
                            </Button>
                        </Grid>
                    </Grid>
                    :

                    <Grid container spacing={1} style={{ height: '85vh' }}>
                        <Grid container spacing={1} >
                            <Grid item xs={3} >
                                <ToggleButtons
                                    cy={cy}
                                    eh={eh}
                                    incrementaCountEtapas={this.incrementaCountEtapas}
                                    incrementaCountPergs={this.incrementaCountPergs}
                                    proximoNo={this.proximoNo}
                                    getNodeIDs={this.getNodeIDs}
                                    NodeOptions={NodeOptions}
                                />
                            </Grid>
                            <Grid item xs={9} >
                                <Grid container spacing={1} justifyContent="center" alignItems="center" >
                                    <Grid item xs={4}>
                                        <TextField id="d-titulo"
                                            value={diagramaInfo.titulo}
                                            onChange={this.setItem}
                                            label="Título do Diagrama" variant="outlined"
                                            size="small"
                                            name="titulo"
                                        />
                                        <IconButton aria-label="descricao-button" onClick={this.toggleDescricao}>
                                            <FaInfoCircle />
                                        </IconButton>
                                    </Grid>
                                    {showDescricao ? (
                                        <Grid item xs={2}>
                                            <TextField
                                                id="descricao"
                                                label="Descrição"
                                                multiline
                                                maxRows={3}
                                                size="small"
                                                name="descricao"
                                                onChange={this.setItem}
                                                value={diagramaInfo.descricao}
                                            />
                                        </Grid>
                                    ) : null }
                                    <Grid item xs={3}>
                                        <Button variant="outlined"
                                            onClick={() => { this.togglePresentationMode() }}>
                                            Apresentar
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ToggleButton
                                            value="check"
                                            selected={viewMode}
                                            onChange={() => {
                                                this.toggleViewMode();
                                            }}
                                            color="secondary"
                                        > Preview
                                        </ToggleButton>
                                    </Grid>

                                    <Grid item xs={1}>
                                        <Button variant="outlined"
                                            onClick={this.salvar}>
                                            Salvar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}
                            style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                            <div style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #179487'
                            }}
                            >
                                <CytoscapeComponent
                                    id="cy"
                                    style={{ flex: 1 }}
                                />
                            </div>

                            <Grid container spacing={8}
                                style={{
                                    justifyContent: 'flex-start',
                                    paddingTop: '1rem',
                                    marginBottom: '2rem'
                                }}
                            >
                                <Grid item xs={6} >
                                    <Button style={{ color: "#00695c" }} onClick={() => this.noAnterior()}>
                                        <FaArrowLeft size={42} />
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button style={{ color: "#00695c" }} onClick={() => this.proximoNo()}>
                                        <FaArrowRight size={42} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={9} style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <DiagramaManager
                                etapaAtual={etapaAtual} viewMode={viewMode}
                                setExcalidrawApi={this.setExcalidrawApi}
                            />
                        </Grid>
                    </Grid>
                }
                {this.state.isInteracaoOpen ? (
                    <ModalInteracao
                        etapaAtual={cy.$('#' + etapaAtual)}
                        proximoNo={this.proximoNo} // testar this.atualizarEtapaAtual(proxNo);
                        interacaoOpen={this.toggleInteracao}
                        nodes={NodeOptions}
                    />
                ) : null}
                <footer>
                    <Copyright />
                </footer>
            </>
        );
    }
}

export default Diagrama;
