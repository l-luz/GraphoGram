import React, { Component } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { RiFileAddFill, RiQuestionnaireFill, RiNodeTree } from 'react-icons/ri';
import { MdNextPlan } from 'react-icons/md';
import ModalPergunta from './modalPergunta';

class ToggleButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            alignment: null,
            activeItem: {
                pergunta: "",
                respostas: [""]
            }
        };
    }

    adicionarNo = (event) => {
        const { cy, incrementaEtapas } = this.props;
        var evtTarget = event.target;

        if (evtTarget === cy) {
            console.log('tap on background');
        } else {
            const etapas = incrementaEtapas();
            var nodeId = evtTarget.id();
            console.log('tap on  element' + nodeId);
            cy.add({
                group: 'nodes',
                data: { id: 'node' + etapas, label: etapas },
            });
            cy.add({
                group: 'edges',
                data: { source: nodeId, target: 'node' + etapas },
            });
        }
    }

    adicionarDialogo = (event) => {
        const { cy, incrementaPerguntas } = this.props;
        var evtTarget = event.target;
        if (evtTarget === cy) {
            console.log('tap on background');
        } else {
            const perguntas = incrementaPerguntas();
            var nodeId = evtTarget.id();
            console.log('tap on  element' + nodeId);
            cy.add({
                group: 'nodes',
                data: { id: 'pergunta' + perguntas, label: "?" },
                style: {
                    'shape': 'round-diamond', // Altere a forma aqui, por exemplo, para 'circle', 'triangle', 'round-rectangle', etc.
                    // Outras propriedades de estilo aqui
                }
            });
            cy.add({
                group: 'edges',
                data: { source: nodeId, target: 'pergunta' + perguntas },
            });
        }
    }

    handleAlignment = (event, newAlignment) => {
        const { cy } = this.props;
        console.log(newAlignment);
        cy.removeListener('tap');

        if (newAlignment === 'addNode') {
            cy.on('tap', this.adicionarNo);
        }

        if (newAlignment === 'pNode') {
            cy.on('tap', this.adicionarDialogo);
        }
        this.setState({ alignment: newAlignment });
    };

    
    handleSubmit = (item) => {
        this.toggle();
        alert("add dialogo");
    };

    criarResposta = () => {
        const resposta = {
            texto: "",
            IDNo: ""
        }
    }

    criarItem = () => {
        const item = {
            pergunta: "",
            resposta: [this.criarResposta()]
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };


    render() {
        const { alignment } = this.state;
        return (
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={this.handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="addNode" aria-label="Adicionar No" >
                    <RiFileAddFill />
                </ToggleButton>
                <ToggleButton value="pNode" aria-label="Adicionar Dialogo" onClick={this.criarItem}>
                    <RiQuestionnaireFill />
                </ToggleButton>
                <ToggleButton value="editNodes" aria-label="right aligned">
                    <RiNodeTree />
                </ToggleButton>
                <ToggleButton value="transNode" aria-label="justified">
                    <MdNextPlan />
                </ToggleButton>
                {this.state.modal ? (
                    <ModalPergunta
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </ToggleButtonGroup>
        );
    }
}

export default ToggleButtons;
