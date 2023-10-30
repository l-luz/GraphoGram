import React, { Component } from 'react';
import {
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Button,
} from '@mui/material';
import { RiFileAddFill, RiQuestionnaireFill, RiNodeTree } from 'react-icons/ri';
import { TiDelete } from 'react-icons/ti';
import { MdNextPlan } from 'react-icons/md';
import ModalPergunta from './modalPergunta';
import AlertDialog from './modalDelete';

class ToggleButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            toggleOpt: null,
            activeItem: {
                pergunta: '',
                respostas: [{ texto: "", IDNo: "", label: "", readOnly: false }],
            },
            menu: [null, null],
            graphAction: null,
            deleteEl: false,

        };
    }
    handleMenuClick = (event, value, index) => {
        if (this.state.toggleOpt !== value) {
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
        const { cy } = this.props;
        const {graphAction, toggleOpt } = this.state;

        cy.removeListener('tap');
        
        if (toggleOpt === 'transMenu'){
            const selEdges = cy.$('.modify');
            if (graphAction !== null) {
                selEdges.data('transicao', graphAction === 'acumular'); // booleano
            }
            selEdges.toggleClass('modify')
        } else if (toggleOpt === 'delEl') {
            this.setState({deleteEl: true});
        }

        if (newAlignment === 'addNode') {
            cy.on('tap', this.adicionarNo);
        }

        else if (newAlignment === 'pNode') {
            cy.on('tap', this.adicionarDialogo);
        }
        else if (newAlignment === 'delEl') {
            cy.on('tap', this.selElements)
        }
        else if (newAlignment === 'acumular' || newAlignment === 'esconder') { // transMenu
            cy.on('tap', 'edge', (event) => {this.selAresta(event)});
            this.setState({graphAction: newAlignment});
            newAlignment = 'transMenu';
        }
        else if (newAlignment === 'editNodes') {

        }
        this.setState({ toggleOpt: newAlignment });
    };

    adicionarNo = (event) => {
        const { cy, incrementaCountEtapas } = this.props;
        var evtTarget = event.target;

        if (evtTarget !== cy) {
            var nodeId = evtTarget.id();
            console.log('tap on  element' + nodeId);
            const noAtual = cy.$('#' + nodeId);

            if (noAtual.outdegree() === 0) {
                const etapas = incrementaCountEtapas();
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
                    data: { source: 'node' + etapas, target: noVizinho.id(),transicao: false },
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

        var evtTarget = event.target;
        console.log("dialogo" + evtTarget)
        if (evtTarget !== cy) {
            var nodeId = evtTarget.id();

            const labelNode = evtTarget.outgoers(function (ele) {
                if (ele.data("label") === "?") {
                    return ele.isNode();
                }
            })[0];
            if (labelNode) {
                return;
            }

            var nodeId = evtTarget.id();

            let caminhos = [];
            let vizinhosData = [];
            let pergunta = '';
            if (evtTarget.data("label") === '?') { // pega informação do nó
                vizinhosData = evtTarget.data("respostas");
                console.log("?");
                // respData.push({ texto: data.texto, IDNo: data.IDNo, label: data.label });
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
                console.log("normal");
                vizinhos.forEach(vizinho => {
                    console.log('nID do nó vizinho: ' + vizinho.id());
                    const resposta = this.criarResposta(vizinho, vizinho.data("id"), vizinho.data("label"), "");
                    console.log("resp" + vizinho.id(), vizinho.data("id"));
                    console.log(resposta);
                    caminhos.push(resposta);
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
        let countEtapas = incrementaCountEtapas(0);
        console.log("dialogo submit")
        console.log(activeItem.pergunta)
        console.log(activeItem.respostas)
        respFiltro.forEach(data => {
            var id = data.IDNo;
            var label = data.label;
            var isNew = false;
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
            const nextNode = cy.$('#' + noAtual).outgoers(function (ele) {
                return ele.isNode();
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
            console.log("oldResp")
            console.log(oldResp)

            if (noAtual.outdegree() === 0 || nextNode.data("label") !== '?') { // é preciso criar um nó dialogo
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
                    style: {
                        'shape': 'round-diamond',
                    }
                });

                cy.add({ // criar noSelecionado -> novaAresta -> noDialogo
                    group: 'edges',
                    data: { source: noAtual.id(), target: pergID },
                });
                if (noAtual.outdegree() > 1) {
                    cy.$('#' + noAtual).outgoers(function (ele) { //remover aresta de noSelecionado -> arestaVizinha -> noSeguinte 
                        return ele.isEdge();
                    })[0].remove();
                }
            }

            let soma = 0;
            let etapas = incrementaCountEtapas(soma);

            // adiciona os novos Nos necessarios e os liga
            respData.forEach(resp => {
                let respId = resp.IDNo;
                console.log(respId + " " + resp.label + " " + resp.texto);

                if (resp.novoNo) {
                    const novaEtapa = etapas + soma;
                    console.log(novaEtapa);
                    console.log("novoNo")
                    respId = 'node' + novaEtapa;
                    cy.add({
                        group: 'nodes',
                        data: { id: respId, label: novaEtapa, elements: [] },
                    });
                    cy.add({
                        group: 'edges',
                        data: { source: pergID, target: respId },
                    });
                    soma++;
                }
                else {
                    if (!oldResp.includes(respId)) {
                        console.log("add aresta")
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
            this.setState({ modal: !this.state.modal });
        }
    };

    selAresta = (event) => {
        const { cy } = this.props;
        var evtTarget = event.target;
        console.log("transicao")
        if (evtTarget !== cy) { // selecionar com shift para multiplo
            var edgeId = evtTarget.id();
            if (cy.$('#' + edgeId).isEdge()) {
                cy.$('#' + edgeId).toggleClass('modify')
                console.log("mudança")
            }
        }
    }

    selElements = (event) => {
        const { cy } = this.props;
        var evtTarget = event.target;
        console.log("del")
        if (evtTarget !== cy) { // selecionar com shift para multiplo
            var edgeId = evtTarget.id();
                cy.$('#' + edgeId).toggleClass('modify')
        }
    }
    selNos = (event) => {
        const { cy } = this.props;
        var evtTarget = event.target;
        console.log("transicao")
        if (evtTarget !== cy) { // selecionar com shift para multiplo
            var edgeId = evtTarget.id();
            if (cy.$('#' + edgeId).isEdge()) {
                cy.$('#' + edgeId).toggleClass('modify')
                console.log("mudança")
            }
        }    }

    setDeleteState = (state) => {
        this.setState({deleteEl: state})
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

    criarItem = (preResp, perg) => {
        var respostas = [this.criarResposta()];

        if (preResp) {
            respostas = preResp;
            respostas.push(this.criarResposta());
        }
        const item = {
            pergunta: perg,
            respostas: respostas
        };
        this.props.getNodeIDs();
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    setPergunta = (e) => {
        const {activeItem} = this.state;
        const newActiveItem = { ... activeItem, pergunta: e.target.value };
        this.setState({ activeItem: newActiveItem });    

    }
    render() {
        const { toggleOpt, menu } = this.state;
        const { NodeOptions } = this.props;
        const openTransMenu = Boolean(menu[0]);
        const openEditMenu = Boolean(menu[1]);
        return (
            <>
                <ToggleButtonGroup
                    value={toggleOpt}
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
                        <MenuItem value="mesclar" onClick={(event) => this.handleGraphActions(event, "mesclar")}>Mesclar Nós</MenuItem>
                        <MenuItem value="separar" onClick={(event) => this.handleGraphActions(event, "separar")}>Separar Nós</MenuItem>
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
                        onClose={() => this.handleMenuClose( 0)}
                        MenuListProps={{
                            'aria-labelledby': 'trans-menu',
                        }}
                    >
                        <MenuItem value="acumular" onClick={(event) => this.handleGraphActions(event, "acumular")}>Acumular</MenuItem>
                        <MenuItem value="esconder" onClick={(event) => this.handleGraphActions(event, "esconder")}>Esconder</MenuItem>
                    </Menu>
                    {/* </Tooltip> */}
                    {/* <Tooltip title="Remova elementos do grafo"> */}
                    <ToggleButton value="delEl" aria-label="Delete Elements">
                        <TiDelete />
                    </ToggleButton>
                    {/* </Tooltip> */}
                    
                    {this.state.modal ? (
                        <ModalPergunta
                            activeItem={this.state.activeItem}
                            toggle={this.toggle}
                            onSave={this.handleDialogoSubmit}
                            nodes={NodeOptions}
                            setPergunta={this.setPergunta}
                        />
                    ) : null}
                    {this.state.deleteEl ? (
                        <AlertDialog
                            cy = {this.props.cy}
                            toggle={this.toggle}
                            setDeleteState={this.setDeleteState}
                        />
                    ) : null}

                </ToggleButtonGroup>
            </>
        );
    }
}

export default ToggleButtons;
