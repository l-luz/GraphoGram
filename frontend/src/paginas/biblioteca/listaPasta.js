import React, { Component } from 'react';
import '../paginas.css';
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Paper, Card, Grid, Link, Button,
    IconButton, Menu, MenuItem, Typography
} from '@mui/material';
import AddPasta from './formPasta';

// // Teste
// const foldersData = [
//     { id: 1, nome: 'Pasta 1' },
//     { id: 2, nome: 'Pasta 2' },
//     { id: 3, nome: 'Pasta 3' },
//     { id: 4, nome: 'Pasta 4' },


//     // ... mais pastas
// ];

// const diagramsData = [
//     { id: 1, titulo: 'Diagrama 1', thumbnail: 'url_da_thumbnail_1.jpg' },
//     { id: 2, titulo: 'Diagrama 2', thumbnail: 'url_da_thumbnail_2.jpg' },
//     // ... mais diagramas
// ];


function ItemPasta({ item }) {
    return (
        <Button href={`/pastas/${item.id}`}>
            <Paper
                className="folder-list item-list"
                elevation={6}
                textalign='center'
                style={{
                    padding: '0 20px',
                    boxSizing: 'border-box'
                }}>
                {item.nome}
            </Paper>
        </Button>
    );
}

function ItemDiagrama({ item }) {
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
                            border: '2px solid #53C3B8',
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
        var pageId = Number(path[path.length - 1]);
        if (isNaN(pageId)) {
            pageId = '';  
        }       

        this.setState({ id:pageId }, () => {
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
        const { pastas, diagramas, id } = this.state;
        return (
            <div className="Biblioteca" >
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <h1 style={{ marginlE: '20' }}>Biblioteca</h1>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined">Editar</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={this.criarItem}>
                            <TbPlus size={20} /> Nova Pasta
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined">
                            <TbPlus size={20} /> Novo Diagrama
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
                            <ItemPasta key={folder.id} item={folder} />
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
                            <ItemDiagrama key={diagram.id} item={diagram} />

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
