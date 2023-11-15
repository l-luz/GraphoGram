import React, { Component } from 'react';
import {
    ToggleButton,
    ToggleButtonGroup,
    Menu,
    MenuItem,
    Button,
    Grid
} from '@mui/material';
import { RiFileAddFill, RiQuestionnaireFill, RiNodeTree } from 'react-icons/ri';
import { MdNextPlan } from 'react-icons/md';
import ModalPergunta from './modalPergunta';
import AlertDialog from './modalDelete';

class ToggleButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPerg: false,
            modalDel: false,
            toggledOpt: null,
            graphAction: null,
            activeItem: {
                pergunta: '',
                respostas: [{ texto: "", IDNo: "", label: "", readOnly: false }],
            },
            menu: [null, null],
        };
    }

    handleMenuClick = (event, value, index) => {
        if (this.state.toggledOpt !== value) {
            const newMenu = [...this.state.menu];
            newMenu[index] = event.currentTarget;
            this.setState({ menu: newMenu });
        }
    };

    handleMenuClose = (index) => {
        const newMenu = [...this.state.menu];
        newMenu[index] = null;
        this.setState({ menu: newMenu });
    };

    handleGraphActions = (event, newAlignment) => {
        const { cy, eh } = this.props;
        const { graphAction, toggledOpt } = this.state;

        cy.removeListener('tap');
        eh.disableDrawMode();

        if (toggledOpt === 'transMenu') {
            const selEdges = cy.$('.modify');
            if (graphAction !== null) {
                selEdges.data('transicao', graphAction === 'acumular'); // booleano
            }
            selEdges.toggleClass('modify')
        } else if (toggledOpt === 'delEl') {
            this.setState({ modalDel: true });
        }

        if (newAlignment === 'addNode') {
            cy.on('tap', this.adicionarNo);
        }
        else if (newAlignment === 'pNode') {
            cy.on('tap', this.adicionarDialogo);
        }
        else if (newAlignment === 'delEl') {
            cy.on('tap', this.selElements)
            this.setState({ graphAction: newAlignment });
            newAlignment = 'editNodes';
        }
        else if (newAlignment === 'acumular' || newAlignment === 'esconder') { // transMenu
            cy.on('tap', 'edge', (event) => { this.selElements(event, "edge") });
            this.setState({ graphAction: newAlignment });
            newAlignment = 'transMenu';
        }
        else if (newAlignment === 'addEdge') {
            eh.enableDrawMode({
            });
            this.setState({ graphAction: newAlignment });
            newAlignment = 'editNodes';
        }
        this.setState({ toggledOpt: newAlignment });
    };


    adicionarNo = (event) => {
        const { cy, incrementaCountEtapas } = this.props;
        let evtTarget = event.target;

        if (evtTarget !== cy) {
            let nodeId = evtTarget.id();
            const noAtual = cy.$('#' + nodeId);

            if (noAtual.outdegree() === 0) {
                const etapas = incrementaCountEtapas();
                console.log(etapas)
                cy.add({
                    group: 'nodes',
                    data: { id: 'node' + etapas, label: etapas, elements: [] },
                });
                cy.add({
                    group: 'edges',
                    data: { source: nodeId, target: 'node' + etapas, transicao: false },
                });
            } else if (noAtual.outdegree() === 1) {
                /* 
                    estado inicial:  noSelecionado - arestaVizinha - noVizinho
                    estado final: noSelecionado - novaAresta1 - novoNo - novaAresta2 - noVizinho
                */
                const etapas = incrementaCountEtapas();
                console.log(etapas)
                const noVizinho = noAtual.outgoers(function (ele) {
                    return ele.isNode()
                })[0];

                noAtual.outgoers(function (ele) {
                    return ele.isEdge()
                })[0].remove();

                cy.add({
                    group: 'nodes',
                    data: { id: 'node' + etapas, label: etapas, elements: [], },
                });

                cy.add({ // noSelecionado - novoNo 
                    group: 'edges',
                    data: { source: nodeId, target: 'node' + etapas, transicao: false },
                });

                cy.add({ // novoNo - noVizinho
                    group: 'edges',
                    data: { source: 'node' + etapas, target: noVizinho.id(), transicao: false },
                });
            }
            cy.layout({
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            }).run();
        }
    }

    adicionarDialogo = (event) => {
        const { cy } = this.props;

        let evtTarget = event.target;
        if (evtTarget !== cy) {

            const labelNode = evtTarget.outgoers(function (ele) {
                if (ele.hasClass("pergunta")) {
                    return ele.isNode();
                }
            })[0];
            if (labelNode) {
                return;
            }

            let caminhos = [];
            let vizinhosData = [];
            let pergunta = '';
            if (evtTarget.data("label") === '?') { // pega informação do nó
                vizinhosData = evtTarget.data("respostas");
                console.log("adicionar nod dialogos")
                console.log(evtTarget.id())
                vizinhosData.forEach(vizinho => {
                    const resposta = this.criarResposta(true, vizinho.IDNo, vizinho.label, vizinho.texto);
                    caminhos.push(resposta);
                });
                pergunta = evtTarget.data('pergunta')
            }
            else { // verifica adjacentes
                const vizinhos = evtTarget.outgoers(function (ele) {
                    return ele.isNode();
                });
                console.log("visinhso")
                console.log(vizinhos)
                console.log("-------------")
                vizinhos.forEach(vizinho => {
                    const resposta = this.criarResposta(vizinho, vizinho.data("id"), vizinho.data("label"), "");
                    caminhos.push(resposta);
                    console.log(resposta)
                });
            }
            this.criarItem(caminhos, pergunta);

        }
    }

    handleDialogoSubmit = () => {
        const { incrementaCountPergs, incrementaCountEtapas, cy } = this.props;
        const { activeItem } = this.state;
        const respFiltro = activeItem.respostas.filter(item => item.texto.trim() !== "");
        const respData = [];

        let countEtapas = incrementaCountEtapas(0) + 1;
        console.log("dialogo submit")
        console.log(activeItem.pergunta)
        console.log(activeItem.respostas)

        respFiltro.forEach(data => {
            let id = data.IDNo;
            let label = data.label;
            let isNew = false;
            if (data.IDNo === "novoNo") {
                id = "node" + countEtapas;
                label = countEtapas;
                countEtapas++;
                isNew = !isNew;
            }
            respData.push({ texto: data.texto, IDNo: id, label: label, novoNo: isNew });
        })

        if (activeItem.pergunta && respData.length > 0) {
            const noAtual = cy.$(':selected');
            let countPerg = incrementaCountPergs(0);
            const nextNode = noAtual.outgoers(function (ele) {
                if (ele.id() !== noAtual.id()) {
                    return ele.isNode();
                }
            })[0];
            let pergID = 'pergunta' + countPerg;

            const oldResp = [];
            if (noAtual.isNode() && noAtual.data("label") === '?') {
                pergID = noAtual.id();
                console.log("isNode")
                const pergNodeResp = cy.$('#' + pergID).data("respostas");
                pergNodeResp.forEach(resp => {
                    console.log(resp.IDNo)
                    oldResp.push(resp.IDNo);
                });
            }

            if ((noAtual.outdegree() === 0 || nextNode.data("label") !== '?') && oldResp.length === 0) { // é preciso criar um nó dialogo
                /* 
                    estado inicial1: ... noSelecionado
                    estado final2: noSelecionado -> novaAresta -> noDialogo

                    estado inicial2: ... noSelecionado -> arestaVizinha -> noSeguinte
                    estado final2: noSelecionado -> novaAresta1 -> noDialogo -> novaAresta2 -> no seguinte
                */

                countPerg = incrementaCountPergs(1);
                pergID = 'pergunta' + countPerg;
                cy.add({
                    group: 'nodes',
                    data: {
                        id: pergID, label: "?", pergunta: activeItem.pergunta, respostas: respData, elements: []
                    },
                    classes: "pergunta",
                });

                cy.add({ // criar noSelecionado -> novaAresta -> noDialogo
                    group: 'edges',
                    data: { source: noAtual.id(), target: pergID },
                });
                console.log("AAaaaa")
                if (nextNode) {
                    noAtual.outgoers().connectedEdges().forEach(function (edge) {
                        const sourceId = edge.source().id();
                        const targetId = edge.target().id();
                        console.log(sourceId, targetId, noAtual.id(), nextNode.id())
                        if (sourceId === noAtual.id() && targetId === nextNode.id()) {
                            edge.remove();
                        }
                    });

                }
            }

            let soma = 0;
            let etapas = incrementaCountEtapas(soma);

            // adiciona os novos Nos necessarios e os liga
            respData.forEach(resp => {
                let respId = resp.IDNo;

                if (resp.novoNo) {
                    soma++;
                    const novaEtapa = etapas + soma;
                    respId = 'node' + novaEtapa;
                    console.log("respId: " + respId)
                    cy.add({
                        group: 'nodes',
                        data: { id: respId, label: novaEtapa, elements: [] },
                    });
                    cy.add({
                        group: 'edges',
                        data: { source: pergID, target: respId },
                    });
                }
                else {
                    if (!oldResp.includes(respId)) {
                        cy.add({
                            group: 'edges',
                            data: { source: pergID, target: respId },
                        });
                    }
                }
            });

            incrementaCountEtapas(soma);
            cy.layout({
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            }).run();
            this.setState({ modalPerg: !this.state.modalPerg });
        }
    };

    selElements = (event, type) => {
        const { cy } = this.props;
        let evtTarget = event.target;
        if (evtTarget !== cy) { // selecionar com shift para multiplo
            let edgeId = evtTarget.id();
            
            if (type === "edge" && cy.$('#' + edgeId).isEdge()) {
                cy.$('#' + edgeId).toggleClass('modify')
            }
            else if (type === "node" && cy.$('#' + edgeId).isNode()) {
                cy.$('#' + edgeId).toggleClass('modify')
            }
            else{
                cy.$('#' + edgeId).toggleClass('modify')
            }
        }
    }

    setDeleteState = (state) => {
        this.setState({ modalDel: state })
    }

    criarResposta = (node, nodeId, nodeLabel, nodeTexto) => {
        if (node === undefined) {
            nodeId = "novoNo";
            nodeLabel = "";
            nodeTexto = "";
        }

        const resposta = {
            texto: nodeTexto,
            IDNo: nodeId,
            label: nodeLabel,
            readOnly: !(node === undefined)
        }
        return resposta;
    };

    criarItem = (resps, perg) => {
        let respostas = [this.criarResposta()];

        if (resps) {
            respostas = resps;
            respostas.push(this.criarResposta());
        }
        console.log("criar item")
        console.log(respostas)
        const item = {
            pergunta: perg,
            respostas: respostas
        };
        this.props.getNodeIDs();
        this.setState({ activeItem: item, modalPerg: !this.state.modalPerg });
    };

    setPergunta = (e) => {
        const { activeItem } = this.state;
        const newActiveItem = { ...activeItem, pergunta: e.target.value };
        this.setState({ activeItem: newActiveItem });
    }

    render() {
        const { toggledOpt, menu } = this.state;
        const { NodeOptions } = this.props;
        const openTransMenu = Boolean(menu[0]);
        const openEditMenu = Boolean(menu[1]);
        return (
            <>
                <Grid container>
                    <Grid item>
                        <ToggleButtonGroup
                            value={toggledOpt}
                            exclusive
                            onChange={this.handleGraphActions}
                            aria-label="text alignment"
                        >
                            {/* toggles de manipulação do grafo */}
                            {/* <Tooltip title="Crie um novo canvas"> */}
                            <ToggleButton value="addNode" aria-label="Adicionar No" >
                                <RiFileAddFill />
                            </ToggleButton>
                            {/* </Tooltip> */}
                            {/* <Tooltip title="Adicione uma interação"> */}
                            <ToggleButton value="pNode" aria-label="Adicionar Dialogo" >
                                <RiQuestionnaireFill />
                            </ToggleButton>
                            {/* </Tooltip> */}
                            <ToggleButton
                                value="editNodes"
                                aria-label="right aligned"

                                id="edit-menu"
                                aria-controls={openEditMenu ? 'edit-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openEditMenu ? 'true' : undefined}
                                onClick={(event) => this.handleMenuClick(event, "editMenu", 1)}
                            >
                                <RiNodeTree />
                            </ToggleButton>
                            <Menu
                                id="edit-menu"
                                anchorEl={menu[1]}
                                open={openEditMenu}
                                onClose={() => this.handleMenuClose(1)}
                                MenuListProps={{
                                    'aria-labelledby': 'edit-menu',
                                }}
                            >
                                <MenuItem value="addEdge" onClick={(event) => this.handleGraphActions(event, "addEdge")}>+ Aresta</MenuItem>
                                <MenuItem value="delEl" onClick={(event) => this.handleGraphActions(event, "delEl")}>Remover</MenuItem>

                            </Menu>

                            {/* toggle relacionado a ações do diagrama */}
                            {/* <Tooltip title="Personalize as transições entre etapas"> */}
                            <ToggleButton
                                value="transMenu"
                                aria-label="justified"
                                id="trans-menu"
                                aria-controls={openTransMenu ? 'trans-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openTransMenu ? 'true' : undefined}
                                onClick={(event) => this.handleMenuClick(event, "transMenu", 0)}
                            >
                                <MdNextPlan />
                            </ToggleButton>
                            <Menu
                                id="trans-menu"
                                anchorEl={menu[0]}
                                open={openTransMenu}
                                onClose={() => this.handleMenuClose(0)}
                                MenuListProps={{
                                    'aria-labelledby': 'trans-menu',
                                }}
                            >
                                <MenuItem value="acumular" onClick={(event) => this.handleGraphActions(event, "acumular")}>Acumular</MenuItem>
                                <MenuItem value="esconder" onClick={(event) => this.handleGraphActions(event, "esconder")}>Esconder</MenuItem>
                            </Menu>
                            {/* </Tooltip> */}
                            {this.state.modalPerg ? (
                                <ModalPergunta
                                    activeItem={this.state.activeItem}
                                    toggle={this.toggle}
                                    onSave={this.handleDialogoSubmit}
                                    nodes={NodeOptions}
                                    setPergunta={this.setPergunta}
                                />
                            ) : null}

                            {this.state.modalDel ? (
                                <AlertDialog
                                    cy={this.props.cy}
                                    toggle={this.toggle}
                                    setDeleteState={this.setDeleteState}
                                    proximoNo={this.props.proximoNo}
                                />
                            ) : null}

                        </ToggleButtonGroup>
                    </Grid>
                    {/* <Grid item>
                {this.newActiveItem ? (
                        <Button onClick={this.handleGraphActions}>Confirmar</Button>
                    ) : null}
                </Grid> */}
                </Grid>
            </>
        );
    }
}

export default ToggleButtons;
