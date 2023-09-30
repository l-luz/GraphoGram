import React, { Component } from 'react';
import './paginas.css';
// import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Paper, Card, Grid, Link, Button,
    IconButton, Menu, MenuItem, Typography
} from '@mui/material';

const disciplinaData = [
    {
        id: 1, turma: '3wA',
        disciplina: {
            codigo: 'inf1234',
            nome: 'Disciplina 1'
        },
        alunos: [
            { id: 101, nome: 'Alice' },
            { id: 102, nome: 'Bob' },
            { id: 103, nome: 'Carol' },
        ]
    },
    {
        id: 2, turma: '3wB',
        disciplina: {
            codigo: 'inf2345',
            nome: 'Disciplina 2'
        },
        alunos: [
            { id: 201, nome: 'David' },
            { id: 202, nome: 'Eve' },
            { id: 203, nome: 'Frank' },
        ]
    },
    {
        id: 3, turma: '3wC',
        disciplina: {
            codigo: 'inf3456',
            nome: 'Disciplina 3'
        },
        alunos: [
            { id: 301, nome: 'Grace' },
            { id: 302, nome: 'Hannah' },
            { id: 303, nome: 'Isaac' },
        ]
    },
    {
        id: 4, turma: '3wE',
        disciplina: {
            codigo: 'inf7890',
            nome: 'Disciplina 4'
        },
        alunos: [
            { id: 401, nome: 'Jack' },
            { id: 402, nome: 'Karen' },
            { id: 403, nome: 'Liam' },
        ]
    },
    // ... mais disciplinas
];


function Alunos({ item }) {

    const ITEM_HEIGHT = 60;
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
                width: '300px',
                height: '300px',
                padding: '0 20px',
                boxSizing: 'border-box'
            }}
        >
            <Grid container alignItems="center">
                <Grid item xs={10}>
                    <br></br>
                    <Typography variant="h5" gutterBottom>
                        {item.titulo}
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
                <Link href={`diagrama/${item.id}`} >
                    <div
                        style={{
                            width: '250px',
                            height: '200px',
                            boxSizing: 'border-box',
                            display: 'flex',             // Usar flexbox para centralizar horizontalmente
                            justifyContent: 'center',    // Centralizar horizontalmente
                            alignItems: 'center',        // Centralizar verticalmente

                        }}
                    >
                        <img src={item.thumbnail} alt={item.titulo} />
                    </div>
                </Link>
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
    render() {
        return (
            <div className="Turma" >
                <Grid container alignItems="center">
                    <Grid item xs={10}>
                    <h1 style={{ marginleft: '20' }}>Turma</h1>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined">
                            <TbPlus size={20} /> Nova Turma
                        </Button>
                    </Grid>
                </Grid>

                <hr />
                <div className="alunos">
                    <h2 style={{ marginlE: '20' }}>Alunos</h2>
                    <Stack
                        className="diagram-list"
                        marginTop={5}
                        marginLeft={5}
                        spacing={{ xs: 1, sm: 5 }}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {disciplinaData.map((diagram) => (
                            <Alunos key={diagram.id} item={diagram} />

                        ))}
                    </Stack>
                </div>
            </div>
        );
    }
};


export default Turma;
