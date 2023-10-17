import React, { Component } from 'react';
import '../paginas.css';
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Card, Grid, Button,
    IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddTurma from './formTurma';

const turmaData = [
    {
        id: 1, turma: '3wA',
        disciplina: {
            codigo: 'inf1234',
            nome: 'Disciplina 1'
        },
        alunos: [
            { id: 401, nome: 'Jack Efron' },
            { id: 402, nome: 'Karen Karente' },
            { id: 403, nome: 'Liam Reinaldo' },

            { id: 101, nome: 'Alice Mendes ' },
            { id: 102, nome: 'Bob Silva' },
            { id: 103, nome: 'Carol Oliveira' },

        ]
    },
    {
        id: 2, turma: '3wB',
        disciplina: {
            codigo: 'inf2345',
            nome: 'Disciplina 2'
        },
        alunos: [
            { id: 201, nome: 'David Martins Mendonça' },
            { id: 202, nome: 'Eve Pinheiro Leal' },
            { id: 203, nome: 'Frank Sode Heart' },
        ]
    },
    {
        id: 3, turma: '3wC',
        disciplina: {
            codigo: 'inf3456',
            nome: 'Disciplina 3'
        },
        alunos: [
            { id: 301, nome: 'Grace Pascal' },
            { id: 302, nome: 'Hannah Almeida Pereira' },
            { id: 303, nome: 'Isaac Newton' },
        ]
    },
    {
        id: 4, turma: '3wE',
        disciplina: {
            codigo: 'inf7890',
            nome: 'Disciplina 4'
        },
        alunos: [
            { id: 401, nome: 'Jack Efron' },
            { id: 402, nome: 'Karen Karente' },
            { id: 403, nome: 'Liam Reinaldo' },
        ]
    },
    // ... mais disciplinas
];

function ListaAlunos({ alunos }) {
    return (
        <TableContainer sx={{ maxHeight: 225 }}>
            <Table stickyHeader sx={{ minWidth: 100 }} aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Nome</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {alunos.map((aluno) => (
                        <TableRow
                            key={aluno.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">{aluno.nome}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


function InstanciaTurma({ item }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const options = [
        'Phobos',
        'Pyxis',
        'Sedna',
        'Titania',
        'Triton',
        'Umbriel',
    ];
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <Card
            className="diagram-card"
            elevation={6}
            style={{
                width: '500px',
                height: '300px',
                padding: '0 20px',
                boxSizing: 'border-box'
            }}
        >
            <Grid container alignItems="center">
                <Grid item xs={10}>
                    <br></br>
                    <Typography variant="h5" gutterBottom>
                        {item.turma} {item.disciplina.codigo} {item.disciplina.nome}
                    </Typography>
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

            <div className="diagram-preview"
                style={{
                    width: '250px',
                    height: '200px',
                    boxSizing: 'border-box'
                }}
            >
                <ListaAlunos alunos={item.alunos} />
            </div>

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
                    width: '20ch',
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Card>
    );
}


class Turma extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            modal: false,
            activeItem: {
                turma: "",
                disciplina: "",
                ano: "",
                periodo: "",
                responsavel: "",

            },
        };
    }


    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
        axios
            .get("/api/turmas/")
            .then((res) => this.setState({ todoList: res.data }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();

        if (item.id) {
            axios
                .put(`/api/turmas/${item.id}/`, item)
                .then((res) => this.refreshList());
            return;
        }
        axios
            .post("/api/turmas/", item)
            .then((res) => this.refreshList());
        console.log("adicionando turma");
    };

    //   handleDelete = (item) => {
    //     axios
    //       .delete(`/api/turmas/${item.id}/`)
    //       .then((res) => this.refreshList());
    //   };

    createItem = () => {
        const item = {
            turma: "",
            disciplina: "",
            ano: "",
            periodo: "",
            responsavel: "",
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    //   displayCompleted = (status) => {
    //     if (status) {
    //       return this.setState({ viewCompleted: true });
    //     }

    //     return this.setState({ viewCompleted: false });
    //   };


    render() {
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
                        {turmaData.map((turma) => (
                            <InstanciaTurma key={turma.id} item={turma} />

                        ))}
                    </Stack>
                </div>
                {this.state.modal ? (
                    <AddTurma
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}

            </div>
        );
    }
};


export default Turma;
