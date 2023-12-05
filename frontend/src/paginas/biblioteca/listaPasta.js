import React, { Component, useState } from 'react';
import '../paginas.css';
import axios from "axios";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Paper, Grid, Link, Button,
    IconButton, Menu, MenuItem,
} from '@mui/material';
import AddPasta from './formPasta';
import DeleteItem from './modalDelete'

function ItemPasta({ item, refresh}) {
    const [deleteDial, setDeletDial] = useState(false);
    // const [deletado, set] = useState(false);
    const handleDelete = () => {
        setDeletDial(!deleteDial);
    };

    const handleClose = () =>{
        setDeletDial(!deleteDial);
    }

    const deleted = () => {
        refresh();
    }
    return (

        <Paper
            className="folder-list item-list"
            elevation={6}
            textalign='center'
            style={{
                padding: '0 20px',
                boxSizing: 'border-box'
            }}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Button xs={4} href={`/pastas/${item.id}`} >
                        {item.nome}
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button xs={1} onClick={handleDelete} >
                        <FiTrash2 />
                    </Button>
                </Grid>
            </Grid>
            { deleteDial ?
            (
                <DeleteItem item={item} deleteDial={deleteDial} handleClose={handleClose} deleted={deleted} />
            ) : null
            }

        </Paper >
    );
}

function ItemDiagrama({ item, refresh }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDial, setDeletDial] = useState(false);
    const open = Boolean(anchorEl);


    const handleDelete = () => {
        setDeletDial(!deleteDial);
        refresh();
    };

    const options = [
        'Apagar',
        'Descrição',
    ];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper
            className="folder-list item-list"
            elevation={6}
            textalign='center'
            style={{
                padding: '0 20px',
                boxSizing: 'border-box',
                width: '192px',
                height: '48px',
            }}>

            <Grid container alignItems="center" textalign='center' justify="space-between">
                <Grid item xs={10}>
                    <br></br>
                    <Link href={`diagrama/${item.id}`} color="inherit" underline="none">
                        {item.titulo}
                    </Link>
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
                        onClick={option === 'Apagar' ? handleDelete : handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
            { deleteDial ?
            (
                <DeleteItem item={item} deleteDial={deleteDial} setDeletDial={setDeletDial}/>
            ) : null
            }
        </Paper>
    );
}


class Biblioteca extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            pastas: [],
            diagramas: [],
            id: "",
            activeItem: {
                nome: ""
            },
        };
    }

    refreshList = () => {
        axios
            .get(`/api/pastas/${this.state.id}`)
            .then((res) => {
                this.setState({
                    pastas: res.data.pastas,
                    diagramas: res.data.diagramas
                });
            })
            .catch((err) => console.log(err));
    };

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        const path = window.location.href.split('/');
        let pageId = Number(path[path.length - 1]);
        if (isNaN(pageId)) {
            pageId = '';
        }

        this.setState({ id: pageId }, () => {
            this.refreshList();
        });

    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        item["descendente"] = this.state.id;

        if (item.id) {
            axios
                .put(`/api/pastas/${item.id}/`, item)
                .then((res) => this.refreshList());
            return;
        }
        axios
            .post("/api/pastas/", item)
            .then((res) => this.refreshList());
        console.log("adicionando pasta");

    };

    criarItem = () => {
        const item = {
            nome: ""
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    render() {
        const { pastas, diagramas } = this.state;
        return (
            <div className="Biblioteca" >
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <h1 style={{ marginlE: '20' }}>Biblioteca</h1>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={this.criarItem}>
                            <TbPlus size={20} /> Nova Pasta
                        </Button>
                    </Grid>
                </Grid>
                <div className="pastas" >
                    <h2 style={{ marginlE: '20' }}>Pastas</h2>
                    <Stack
                        className="folder-list"
                        marginTop={5}
                        marginBottom={8}
                        marginLeft={5}
                        spacing={{ xs: 1, sm: 5 }}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {pastas.map((folder) => (
                            <ItemPasta key={folder.id} item={folder} refresh={this.refreshList} />
                        ))}
                    </Stack>
                </div>
                <hr />
                <div className="diagramas">
                    <h2 style={{ marginlE: '20' }}>Diagramas</h2>
                    <Stack
                        className="diagram-list"
                        marginTop={5}
                        marginLeft={5}
                        spacing={{ xs: 1, sm: 5 }}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {diagramas.map((diagram) => (
                            <ItemDiagrama key={diagram.id} item={diagram} refresh={this.refreshList} />

                        ))}
                    </Stack>
                </div>
                {this.state.modal ? (
                    <AddPasta
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}

            </div>
        );
    }
};

export default Biblioteca;
