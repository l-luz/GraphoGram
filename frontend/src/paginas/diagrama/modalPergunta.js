import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import { HiOutlinePlus } from 'react-icons/hi';
import Grid from "@mui/material/Grid"
function InstanciaResposta({ count_resp, activeItem, handleChange }) {
    return (
        <FormGroup>
            <div className="row">
                <div className="col-md-9">
                    <Label for="etapa-pergunta">Resposta {count_resp}: </Label>
                    <Input
                        type="text"
                        id="etapa-resposta"
                        name="texto"
                        value={activeItem.texto}
                        onChange={handleChange}
                        placeholder="Insira a resposta"
                    />
                </div>
                <div className="col-md-3">
                    <Label for="etapa-pergunta">Caminho: </Label>
                    <Input
                        type="text"
                        id="etapa-caminho"
                        name="IDNo"
                        value={activeItem.IDNo}
                        onChange={handleChange}
                        placeholder="ID"
                    />
                </div>
            </div>
        </FormGroup>
    );
}

class ModalPergunta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
            modalRef: null,
            activeItem: { pergunta: '', respostas: [{ texto: '', IDNo: '' }] },
            count_resp: 1,
        };
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    handleAddResposta = () => {
        const activeItem = { ...this.state.activeItem };
        activeItem.respostas.push({ texto: '', IDNo: '' });
        this.setState({ activeItem, count_resp: this.state.count_resp + 1 });
    };

    render() {
        const { activeItem, modalOpen, modalRef, count_resp } = this.state;

        return (
            <Modal isOpen={modalOpen} toggle={this.toggleModal} innerRef={modalRef}>
                <ModalHeader toggle={this.toggleModal}> Pergunta </ModalHeader>
                <ModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                    <Form>
                        <FormGroup>
                            <Label for="etapa-pergunta">Pergunta</Label>
                            <Input
                                type="text"
                                id="etapa-pergunta"
                                name="pergunta"
                                value={activeItem.pergunta}
                                onChange={this.handleChange}
                                placeholder="Insira a pergunta"
                            />
                        </FormGroup>
                        {activeItem.respostas.map((resposta, index) => (
                            <InstanciaResposta
                                key={index}
                                count_resp={index + 1}
                                activeItem={resposta}
                                handleChange={(e) => {
                                    const newRespostas = [...activeItem.respostas];
                                    newRespostas[index][e.target.name] = e.target.value;
                                    const newActiveItem = { ...activeItem, respostas: newRespostas };
                                    this.setState({ activeItem: newActiveItem });
                                }}
                            />
                        ))}
                    </Form>
                </ModalBody>
                <ModalFooter container spacing={2} >

                        <Grid item xs={2} style={{ textAlign: 'right' }}>
                            <Button onClick={this.handleAddResposta} >
                                <HiOutlinePlus />
                            </Button>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                            <Button color="success" onClick={() => this.props.onSave(activeItem)}>
                                Save
                            </Button>
                        </Grid>
                </ModalFooter>
                <div className="modal-overlay" onClick={this.toggleModal}></div>
            </Modal>
        );
    }
}

export default ModalPergunta;
