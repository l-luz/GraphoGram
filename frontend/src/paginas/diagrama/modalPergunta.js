import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { HiOutlinePlus } from 'react-icons/hi';
import {FaTrash} from 'react-icons/fa';
import {
    Select,
    MenuItem,
    Grid,
    FormGroup,
    FormControl,
    TextField,
    Button,

} from "@mui/material"

function InstanciaResposta({ count_resp, resposta, handleChange, IDNos, handleDelete }) {

    return (
        <Grid item container xs={12} alignItems="center" spacing={1}>
        <Grid item xs={6} >
                <FormControl>
                    <TextField
                        multiline
                        label={`Resposta ${count_resp}`}
                        type="text"
                        id={`etapa-resposta-${count_resp}`}
                        name="texto"
                        value={resposta.texto}
                        onChange={handleChange}
                        placeholder="Insira a resposta"
                        required
                    />
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl>
                    {resposta.readOnly ?
                        <TextField
                            label="ID"
                            type="text"
                            id={`etapa-caminho-${count_resp}`}
                            name="IDNo"
                            // value={resposta.IDNo}
                            value={resposta.label}
                            onChange={handleChange}
                            placeholder="ID"
                            disabled

                        /> :
                        <Select
                            type="text"
                            label="ID"
                            id={`etapa-select-${count_resp}`}
                            name="IDNo"
                            value={resposta.IDNo ? resposta.IDNo : ""}
                            onChange={handleChange}
                            placeholder="ID"
                        >
                            {IDNos ? IDNos.map((node) =>
                                <MenuItem key={node.id} value={node.id}>{node.label}</MenuItem>
                            ) : null}

                        </Select>
                    }
                </FormControl>
            </Grid>
            {/* <Grid item xs={2}>
                { resposta.readOnly ?
                null :
                    <Button onChange={handleDelete}><FaTrash /></Button>
                }
            </Grid> */}
        </Grid>
    );
}

class ModalPergunta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
            modalRef: null,
            count_resp: 1,
            erros: {
                pergunta: false,
                resposta: false
            }
        };
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        const activeItem = { ...this.props.activeItem, [name]: value };
        this.setState({ activeItem });
    };


    handleAddResposta = () => {
        const activeItem = { ...this.props.activeItem };
        activeItem.respostas.push({texto: '', IDNo: 'novoNo', label: '', readOnly: false});
        this.setState({ activeItem, count_resp: this.state.count_resp + 1 });
    };

    handleErrors = () => {
        const { activeItem } = this.props;

        if (!activeItem.pergunta) {
            this.setState(prevState => ({
                activeItem: {
                    ...prevState.activeItem,
                    pergunta: true
                },
                erros: {
                    ...prevState.erros,
                    pergunta: true
                }
            }));
        } else {
            this.setState(prevState => ({
                activeItem: {
                    ...prevState.activeItem,
                    pergunta: false
                },
                erros: {
                    ...prevState.erros,
                    pergunta: false
                }
            }));
        }
    }

    handleDelete = (id) => {
        const { activeItem } = this.props;
        const updatedRespostas = activeItem.respostas.filter((resposta, i) => i !== id);
        const newActiveItem = { ...activeItem, respostas: updatedRespostas };
        console.log("filtro")
        console.log(updatedRespostas)
        console.log("antes")
        console.log(activeItem.respostas);
        this.setState({ activeItem: newActiveItem }, () => {
            console.log("depois");
            console.log(this.state.activeItem.respostas);
        });

    };  

    render() {
        const { modalOpen, modalRef, count_resp } = this.state;
        const { activeItem, nodes } = this.props;

        return (
            <Modal isOpen={modalOpen} toggle={this.toggleModal} innerRef={modalRef}>
                <ModalHeader toggle={this.toggleModal}> Adicionar Diálogo na Apresentação </ModalHeader>
                <ModalBody style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                    <Grid container rowSpacing={3} spacing={1}>
                        <Grid item xs={12} >
                            <FormGroup >
                                <TextField
                                    multiline
                                    label="Pergunta"
                                    type="text"
                                    id="etapa-pergunta"
                                    name="pergunta"
                                    value={this.props.activeItem.pergunta}
                                    onChange={(e) => {
                                        const newActiveItem = { ...this.props.activeItem, pergunta: e.target.value };
                                        this.setState({ activeItem: newActiveItem });
                                    }}
                                    placeholder="Insira a pergunta"
                                    required
                                />
                            </FormGroup>
                        </Grid>
                        {activeItem.respostas.map((resposta, index) => (
                            <InstanciaResposta
                                key={index}
                                count_resp={index + 1}
                                resposta={resposta}
                                IDNos={nodes}
                                handleChange={(e) => {
                                    const novaPergunta = [...activeItem.respostas];
                                    novaPergunta[index][e.target.name] = e.target.value;
                                    const newActiveItem = { ...activeItem, respostas: novaPergunta };
                                    this.setState({ activeItem: newActiveItem });
                                }}
                                // handleDelete={() => {
                                //     const updatedRespostas = activeItem.respostas.filter((resposta, i) => i !== index);
                                //     const newActiveItem = { ...activeItem, respostas: updatedRespostas };
                                //     this.setState(prevState => ({ 
                                //         activeItem: newActiveItem 
                                //     }));
                                // }}
                                />
                        ))}

                    </Grid>
                </ModalBody>
                <ModalFooter spacing={2} >

                    <Grid item xs={2} style={{ textAlign: 'right' }}>
                        <Button onClick={this.handleAddResposta} >
                            <HiOutlinePlus />
                        </Button>
                    </Grid>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={2}>
                        <Button color="success" onClick={() =>

                            this.props.onSave(activeItem)
                        }>
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
