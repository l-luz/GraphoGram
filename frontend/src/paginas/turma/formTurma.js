import React, { useState, useEffect, createRef } from 'react';
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
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import axios from 'axios';
import InputFileUpload from "../../components/fileUpload"


const AddTurma = (props) => {
    const [activeItem, setActiveItem] = useState(props.activeItem);
    const [modalOpen, setModalOpen] = useState(true);
    const [disciplina, setDisciplina] = useState({ codigo: '', nome: '' });
    const [disciplinaLista, setDisciplinaLista] = useState([]); // Lista de disciplinas
    const modalRef = createRef(null);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    
    const adicionarDisciplina = async (e) => {
        e.preventDefault();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições

        const novaDisciplina = {
            codigo: disciplina.codigo,
            nome: disciplina.nome,
        };
        try {
            const response = await axios.post('/api/disciplinas/', { 
                novaDisciplina, 
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
                {withCredentials: true});
            
            setDisciplina({ codigo: '', nome: '' });
        } catch (error) {
            console.error('Erro ao adicionar disciplina:', error);
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;


        const updatedItem = { ...activeItem, [name]: value };
        setActiveItem(updatedItem);
    };


    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições

        axios.get('/api/disciplinas/', {
        }, 
        )
            .then((response) => {
                setDisciplinaLista(response.data);
            })
            .catch((error) => {
                console.error('Erro ao recuperar disciplinas:', error);
            });
    }, []);

    return (
        <Modal isOpen={modalOpen} toggle={toggleModal} innerRef={modalRef}>
            <ModalHeader toggle={toggleModal}>Nova Turma</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="turma-disciplina">Disciplina</Label>
                        {disciplinaLista ? (
                            <Select
                                type="text"
                                id="turma-disciplina"
                                name="disciplina"
                                value={activeItem.disciplina}
                                onChange={handleChange}
                                placeholder="Insira a disciplina"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>

                                {disciplinaLista ?

                                    disciplinaLista.map((disciplinaItem) => (
                                        <MenuItem key={disciplinaItem.id} value={disciplinaItem.codigo}>
                                            {disciplinaItem.codigo}
                                        </MenuItem>
                                    ))
                                    :
                                    null
                                }
                            </Select>
                        ) : (
                            <p>Não há disciplinas adicionadas...</p>
                        )}
                        <input
                            type="text"
                            placeholder="Código da Disciplina"
                            name="codigo"
                            value={disciplina.codigo}
                            onChange={(e) => setDisciplina({ ...disciplina, codigo: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Nome da Disciplina"
                            name="nome"
                            value={disciplina.nome}
                            onChange={(e) => setDisciplina({ ...disciplina, nome: e.target.value })}
                        />
                        <button onClick={adicionarDisciplina}>+</button>
                        <FormHelperText>Required</FormHelperText>
                    </FormGroup>
                    <FormGroup>
                        <Label for="turma-turma">Turma</Label>
                        <Input
                            type="text"
                            id="turma-turma"
                            name="turma"
                            value={activeItem.turma}
                            onChange={handleChange}
                            placeholder="Insira a turma"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="turma-ano">Ano</Label>
                        <Input
                            type="text"
                            id="turma-ano"
                            name="ano"
                            value={activeItem.ano}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="turma-periodo">Periodo</Label>
                        <Input
                            type="text"
                            id="turma-periodo"
                            name="periodo"
                            value={activeItem.periodo}
                            onChange={handleChange}
                            placeholder="Insira o periodo"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="turma-responsavel">Responsavel</Label>
                        <Input
                            type="text"
                            id="turma-responsavel"
                            name="responsavel"
                            value={activeItem.responsavel}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                    <InputFileUpload />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={() => props.onSave(activeItem)}>
                    Save
                </Button>
            </ModalFooter>
            <div className="modal-overlay" onClick={toggleModal}></div>
        </Modal>
    );
};

export default AddTurma;
