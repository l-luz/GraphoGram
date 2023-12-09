import React, { Component, useEffect, useState } from 'react';
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Card, Grid, Button,
    IconButton, Menu, MenuItem, Typography, Tooltip,
    Chip

} from '@mui/material';
import { parseISO } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddTurma from './formTurma';
import FullFeaturedCrudGrid from './tabelaAlunos';

function InstanciaTurma({ turma }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleted, setDeleted] = useState(true);
    const [comPerm, setComPerm] = useState(null);
    const [semPerm, setSemPerm] = useState(null);
    const [activeComItem, setActiveComItem] = useState([]);
    const [activeSemItem, setActiveSemItem] = useState([]);
        //     {
        //     dt_ini_vis: '',
        //     dt_fim_vis: '',
        // }
    const getPerms = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        await axios
            .get(`/api/permissoes/${turma.id}/`)
            .then((res) => { setComPerm(res.data.configurados); setSemPerm(res.data.diagramas); })
            .catch((err) => console.error("Erro ao recuperar permissões", err))
    };

    useEffect(() => {
        if (turma) {
            getPerms();
        }
    }, [turma]);

    const open = Boolean(anchorEl);

    const options = [
        'Excluir Turma',
    ];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const setChanges = (name, newValue, index, comPerm) => {
        if (comPerm) {
            const updatedActiveComItem = [...activeComItem];
            updatedActiveComItem[index] = { ...updatedActiveComItem[index], [name]: newValue };
            setActiveComItem(updatedActiveComItem);
        } else {
            const updatedActiveSemItem = [...activeSemItem];
            updatedActiveSemItem[index] = { ...updatedActiveSemItem[index], [name]: newValue };
            setActiveSemItem(updatedActiveSemItem);
        }
    };

    const submitPerm = (index, isComPerm, diagrama_id = null) => async () => {
        const activeItem = isComPerm ? [...activeComItem] : [...activeSemItem];
        let itemToUpdate = activeItem[index];
        if (activeItem[index]) {
            itemToUpdate.dt_ini_vis = itemToUpdate["dt_ini_vis"].toISOString();
            itemToUpdate.dt_fim_vis = itemToUpdate["dt_fim_vis"].toISOString();

            if (diagrama_id) {
                itemToUpdate["diagrama"] = diagrama_id;
            }
            itemToUpdate['turma'] = turma.id;

            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
            if (isComPerm) {
                await axios.put(`/api/permissoes/${itemToUpdate.id}/`, itemToUpdate)
                    .then(getPerms())
                    .catch((err) => console.error("Erro ao editar permissões", err))
            } else {
                await axios.post(`/api/permissoes/`, itemToUpdate)
                    .then(getPerms())
                    .catch((err) => console.error("Erro ao criar permissões", err))
            }
    
            console.table(itemToUpdate)
        }
    };

    const handleOption = (option) => {
        console.log(option)
        if (option === "Excluir Turma") {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
            axios
                .delete(`/api/turmas/${turma.id}/`)
                .catch((err) => console.error("Erro ao deletar Turma", err));
            setDeleted(false);
        }
        handleClose()
    }


    return deleted ? (
        <Card
            className="diagram-card"
            elevation={6}
            style={{
                width: '100%',
                height: '500px',
                padding: '0 20px',
                boxSizing: 'border-box'
            }}
        >
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                    <br></br>
                    <Tooltip title={turma.disciplina.nome}>
                        <Typography variant="h5" gutterBottom>
                            {turma.codigo} | {turma.disciplina.codigo} | {turma.ano}.{turma.periodo}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={2}>
                    <IconButton
                        aria-label="more"
                        style={{ alignSelf: 'flex-end' }}
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <FiMoreVertical />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={2} >
                <Grid item xs={6}>
                    <FullFeaturedCrudGrid turma_id={turma.id} />
                </Grid>
                <Grid item xs={6}>
                    {comPerm ? comPerm.map((item, index) =>
                        <Grid container spacing={1} key={index}>
                            <Grid item xs={3} >
                                <Chip label={`${item.titulo}`} color="secondary" />
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker defaultValue={parseISO(item.dt_ini_vis)} label="Disponibilização" onChange={(newValue) => setChanges('dt_ini_vis', newValue, index, true)} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker defaultValue={parseISO(item.dt_fim_vis)} label="Validade" onChange={(newValue) => setChanges('dt_fim_vis', newValue, index, true)} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={2}>
                                <Button onClick={submitPerm(index, true)}>Salvar</Button>
                            </Grid>
                        </Grid>
                    ) : null}

                    {semPerm ? semPerm.map((item, index) =>
                        <Grid container spacing={1} key={index}>
                            <Grid item xs={3} >
                                <Chip label={`${item.titulo}`} color="warning" />
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker label="Disponibilização" onChange={(newValue) => setChanges('dt_ini_vis', newValue, index, false)} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker label="Validade" onChange={(newValue) => setChanges('dt_fim_vis', newValue, index, false)} />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={2}>
                                <Button onClick={submitPerm(index, false, item.diagrama_id)}>Salvar</Button>
                            </Grid>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                style={{
                    width: '100ch',
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => { handleOption(option) }}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Card>
    ) : null;
}


class Turma extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            modal: false,
            optDisciplinas: [{
                id: "",
                codigo: "",
                nome: ""
            }],
            turmas: [{
                id: "",
                disciplina: "",
                ano: "",
                periodo: "",
                responsavel: "",
                codigo: ""
            }],
        };
    }


    componentDidMount() {
        this.recuperaDisciplinas();
        this.recuperaTurmas();
    }

    recuperaDisciplinas = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
        axios
            .get("/api/disciplinas/")
            .then((res) => this.setState({ optDisciplinas: res.data }))
            .catch((err) => console.error('Erro ao recuperar disciplinas:', err));
    };

    recuperaTurmas = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
        axios
            .get("/api/turmas/")
            .then((res) => this.setState({ turmas: res.data.turmas }))
            .catch((err) => console.error('Erro ao recuperar turmas: ', err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();
        if (item.file) {
            const formData = new FormData();
            formData.append('file', item.file[0]);
            formData.append('disciplina', item.disciplina);
            formData.append('ano', item.ano);
            formData.append('periodo', item.periodo);
            formData.append('codigo', item.codigo);
            if (item.file[0].name != null) {
                axios
                    .post("/api/turmas/", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then((res) => this.recuperaTurmas());
                console.log("adicionando turma");
            }
        }
    };


    createItem = () => {
        const item = {
            disciplina: "",
            ano: "",
            periodo: "",
            codigo: "",
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    render() {
        const { optDisciplinas, turmas } = this.state;
        return (
            <div className="Turma" >
                <Grid container alignItems="center">
                    <Grid item xs={10}>
                        <h1 style={{ marginleft: '20' }}>Turmas</h1>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={this.createItem}>
                            <TbPlus size={20} /> Nova Turma
                        </Button>
                    </Grid>
                </Grid>

                <hr />
                <div className="alunos">
                    <Stack
                        className="diagram-list"
                        marginTop={5}
                        marginLeft={5}
                        spacing={{ xs: 1, sm: 5 }}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {turmas.map((turma) => (
                            <InstanciaTurma key={turma.id} turma={turma} />
                        ))}
                    </Stack>
                </div>
                {this.state.modal ? (
                    <AddTurma
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                        optDisciplinas={optDisciplinas}
                    />
                ) : null}

            </div>
        );
    }
};


export default Turma;
