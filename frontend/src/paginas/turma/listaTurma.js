import React, { Component } from 'react';
import '../paginas.css';
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Card, Grid, Button,
    IconButton, Menu, MenuItem, Typography, Tooltip
} from '@mui/material';
import AddTurma from './formTurma';
import FullFeaturedCrudGrid from './tabelaAlunos';

function InstanciaTurma({ turma }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mostrar, setMostrar] = React.useState(true);
    const open = Boolean(anchorEl);

    const options = [
        'Excluir Turma',
        'Permissões',
    ];
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOption = (option) => {
        console.log(option)
        if (option ==="Excluir Turma"){
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
            axios
            .delete(`/api/turmas/${turma.id}/`)
            .catch((err) => console.error("Erro ao deletar Turma" ,err));
            setMostrar(false);
        }else if (option ==="Permissões"){
            console.log("perm");
        }
        handleClose()
    }

    return mostrar ? (
        <Card
            className="diagram-card"
            elevation={6}
            style={{
                width: '850px',
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
            <Grid item xs={6} >
                <FullFeaturedCrudGrid turma_id={turma.id}/>
            </Grid>
            <Grid item xs={6}>
                {/* Listar diagramas */}
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
                    // maxHeight: ITEM_HEIGHT * 4.5,
                    width: '100ch',
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() => {handleOption(option)}}>
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
            turmas:[{
                id:"", 
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
            .then((res) => this.setState({optDisciplinas: res.data}))
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
        if (item.file){
            const formData = new FormData();
            formData.append('file', item.file[0]);
            formData.append('disciplina', item.disciplina);
            formData.append('ano', item.ano);
            formData.append('periodo', item.periodo);
            formData.append('codigo', item.codigo);
            if (item.file[0].name != null){
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
        const {optDisciplinas, turmas} = this.state;
        return (
            <div className="Turma" >
                <Grid container alignItems="center">
                    <Grid item xs={10}>
                        <h1 style={{ marginleft: '20' }}>Turma</h1>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={this.createItem}>
                            <TbPlus size={20} /> Nova Turma
                        </Button>
                    </Grid>
                </Grid>

                <hr />
                <div className="alunos">
                    <h2 style={{ marginlE: '20' }}>Turmas</h2>
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
