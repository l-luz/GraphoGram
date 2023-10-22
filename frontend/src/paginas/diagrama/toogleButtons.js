import React, { Component } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { RiFileAddFill, RiQuestionnaireFill, RiNodeTree } from 'react-icons/ri';
import { TiDelete } from 'react-icons/ti';
import { MdNextPlan } from 'react-icons/md';
import ModalPergunta from './modalPergunta';

class ToggleButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            alignment: null,
            activeItem: {
                pergunta: '',
                respostas: [{ texto: "", IDNo: "", label: "", readOnly: false }]
            },
            NodeOptions: [{ obj: true, id: "Novo Nó" }]
        };
    }

    handleGraphActions = (event, newAlignment) => {
        const { cy } = this.props;
        console.log("toggle escolhido" + newAlignment);
        cy.removeListener('tap');

        if (newAlignment === 'addNode') {
            cy.on('tap', this.adicionarNo);
        }

        else if (newAlignment === 'pNode') {
            cy.on('tap', this.adicionarDialogo);
        }

        else if (newAlignment === 'editNodes') {

        }
        this.setState({ alignment: newAlignment });

    };

    adicionarNo = (event) => {
        const { cy, incrementaCountEtapas } = this.props;
        var evtTarget = event.target;

        if (evtTarget === cy) {
            console.log('tap on background');
        } else {
            var nodeId = evtTarget.id();
            console.log('tap on  element' + nodeId);

            if (cy.$('#' + nodeId).outdegree() === 0) {
                const etapas = incrementaCountEtapas();
                cy.add({
                    group: 'nodes',
                    data: { id: 'node' + etapas, label: etapas },
                });
                cy.add({
                    group: 'edges',
                    data: { source: nodeId, target: 'node' + etapas },
                });

            } else if (cy.$('#' + nodeId).outdegree() === 1) {
                /* 
                    estado inicial:  noSelecionado - arestaVizinha - noVizinho
                    estado final: noSelecionado - novaAresta1 - novoNo - novaAresta2 - noVizinho
                */
                const etapas = incrementaCountEtapas();
                const noVizinho = cy.$('#' + nodeId).outgoers(function (ele) {
                    return ele.isNode()
                })[0];
                cy.$('#' + nodeId).outgoers(function (ele) {
                    return ele.isEdge()
                })[0].remove();

                cy.add({
                    group: 'nodes',
                    data: { id: 'node' + etapas, label: etapas },
                }); // novo nó

                cy.add({ // conecta noSelecionado - novoNo 
                    group: 'edges',
                    data: { source: nodeId, target: 'node' + etapas },
                });

                cy.add({ // conecta novoNo - noVizinho
                    group: 'edges',
                    data: { source: 'node' + etapas, target: noVizinho.id() },
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
        const { cy, incrementaCountPergs } = this.props;
        const { activeItem } = this.state;

        var evtTarget = event.target;

        if (evtTarget === cy) {
            console.log('tap on background');
        } else {
            var nodeId = evtTarget.id();

            const labelNode = cy.$('#' + evtTarget.id()).outgoers(function (ele) {
                if (ele.data("label") === "?") {
                    return ele.isNode()
                }
            })[0];
            if (labelNode) {
                return;
            }

            var nodeId = evtTarget.id();

            const caminhos = [];
            const vizinhosData = [];
            const perguntas = incrementaCountPergs();

            if (evtTarget.data("label") === '?') {
                vizinhosData = evtTarget.data("respostas");
                console.log("?")
                // respData.push({ texto: data.texto, IDNo: data.IDNo, label: data.label });
                vizinhosData.forEach(vizinho => {
                    console.log('lID do nó vizinho: ' + vizinho.id());
                    const resposta = this.criarResposta(true, vizinho.IDNo, vizinho.label, vizinho.texto);
                    caminhos.push(resposta);
                });
            }
            else {
                const vizinhos = cy.$('#' + nodeId).outgoers(function (ele) {
                    return ele.isNode()
                });    
                console.log("normal")
                vizinhos.forEach(vizinho => {
                    console.log('nID do nó vizinho: ' + vizinho.id());
                    const resposta = this.criarResposta(vizinho, vizinho.data("id"), vizinho.data("label"), "");
                    console.log("resp" + vizinho.id(), vizinho.data("id"))
                    console.log(resposta)
                    caminhos.push(resposta);
                });
            }
            this.criarItem(caminhos);

        }
    }


    handleDialogoSubmit = (item) => {

        const { activeItem } = this.state;
        const respFiltro = activeItem.respostas.filter(item => item.texto.trim() !== "");
        const respData = [];
        respFiltro.forEach(data => {
            respData.push({ texto: data.texto, IDNo: data.IDNo, label: data.label });
        })

        if (activeItem.pergunta && respFiltro.length > 0) {

            const { incrementaCountPergs, incrementaCountEtapas, cy } = this.props;
            const noAtual = cy.$(':selected');
            const countPerg = incrementaCountPergs();
            const nextNode = cy.$('#' + noAtual).outgoers(function (ele) {
                return ele.isNode()
            })[0];
            let pergID = 'pergunta' + countPerg;

            if (noAtual.outdegree() === 0 || nextNode.data("label") !== '?') { // é preciso criar um nó dialogo
                /* 
                    estado inicial1: noSelecionado
                    estado final2: noSelecionado -> novaAresta -> noDialogo

                    estado inicial2: noSelecionado -> arestaVizinha -> noSeguinte
                    estado final2: noSelecionado -> novaAresta1 -> noDialogo -> novaAresta2 -> no seguinte
                */
                cy.add({
                    group: 'nodes',
                    data: {
                        id: pergID, label: "?", pergunta: activeItem.pergunta, respostas: respData
                    },
                    style: {
                        'shape': 'round-diamond',
                    }
                });

                cy.add({ // criar noSelecionado -> novaAresta -> noDialogo
                    group: 'edges',
                    data: { source: noAtual.id(), target: pergID },
                    // style: {
                    //     'shape': 'none',
                    // }
                });
                if (nextNode.data("label") !== '?') {
                    cy.$('#' + noAtual).outgoers(function (ele) { //remover aresta de noSelecionado -> arestaVizinha -> noSeguinte 

                        return ele.isEdge();
                    })[0].remove();

                }
            }

            let soma = 0;
            let etapas = incrementaCountEtapas(soma);
            console.log(etapas)
            // adiciona os novos Nos necessarios e os liga
            activeItem.respostas.forEach(resp => {
                let respId = resp.IDNo;
                console.log(respId + " " + resp.label + " " + resp.texto)
                if (respId === "novoNo") {
                    const novaEtapa = etapas + soma;
                    console.log(novaEtapa)
                    respId = 'node' + novaEtapa;
                    // texto: "", IDNo:"", label: "", readOnly: false
                    cy.add({
                        group: 'nodes',
                        data: { id: respId, label: novaEtapa },
                    });
                    soma++;

                }
                cy.add({
                    group: 'edges',
                    data: { source: pergID, target: respId },
                });
            });
            // incrementaCountEtapas(soma);
            cy.layout({
                name: "dagre",
                padding: 24,
                spacingFactor: 1.5
            }).run();
            this.setState({ modal: !this.state.modal });
        }
    };


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
    }

    criarItem = (preResp) => {
        var respostas = [this.criarResposta()];
        console.log("criaresp")
        console.log(preResp)

        if (preResp) {
            respostas = preResp;
            respostas.push(this.criarResposta());
        }
        const item = {
            pergunta: "pergunta teste",
            respostas: respostas
        };
        this.getNodeIDs();
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    getNodeIDs = () => {
        const { cy } = this.props;
        const nos = [];
        nos.push({ obj: true, id: "novoNo", label: "Novo Nó" });

        cy.nodes().forEach(ele => {
            const no = {
                id: ele.data("id"),
                obj: ele,
                label: ele.data("label")
            }
            nos.push(no);
        });

        this.setState({ NodeOptions: nos, modal: !this.state.modal });
    }

    render() {
        const { alignment, NodeOptions } = this.state;
        return (
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={this.handleGraphActions}
                aria-label="text alignment"
            >
                {/* toggles de manipulação do grafo */}
                <ToggleButton value="addNode" aria-label="Adicionar No" >
                    <RiFileAddFill />
                </ToggleButton>
                <ToggleButton value="pNode" aria-label="Adicionar Dialogo" >
                    <RiQuestionnaireFill />
                </ToggleButton>
                <ToggleButton value="editNodes" aria-label="right aligned" >
                    <RiNodeTree />
                </ToggleButton>
                {/* toggle relacionado a ações do diagrama */}
                <ToggleButton value="transNode" aria-label="justified" >
                    <MdNextPlan />
                </ToggleButton>
                <ToggleButton value="delNode" aria-label="justified" >
                    <TiDelete />
                </ToggleButton>
                <ToggleButton value="mescNode" aria-label="justified" >
                    <TiDelete />
                </ToggleButton>
                <ToggleButton value="sepNode" aria-label="justified" >
                    <TiDelete />
                </ToggleButton>
                {this.state.modal ? (
                    <ModalPergunta
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleDialogoSubmit}
                        nodes={NodeOptions}
                    />
                ) : null}
            </ToggleButtonGroup>
        );
    }
}

export default ToggleButtons;
