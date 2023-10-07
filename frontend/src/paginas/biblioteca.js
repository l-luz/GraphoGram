import React, { Component } from 'react';
import './paginas.css';
// import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Paper, Card, Grid, Link, Button,
    IconButton, Menu, MenuItem, Typography
} from '@mui/material';


// Teste
const foldersData = [
    { id: 1, nome: 'Pasta 1' },
    { id: 2, nome: 'Pasta 2' },
    { id: 3, nome: 'Pasta 3' },
    { id: 4, nome: 'Pasta 4' },


    // ... mais pastas
];

const diagramsData = [
    { id: 1, titulo: 'Diagrama 1', thumbnail: 'url_da_thumbnail_1.jpg' },
    { id: 2, titulo: 'Diagrama 2', thumbnail: 'url_da_thumbnail_2.jpg' },
    // ... mais diagramas
];


function ItemPasta({ item }) {
    return (
        // <Link to={`/pasta/${id}`} style={{ textDecoration: 'none' }}>

        <Button href={`pasta/${item.id}`}>
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

    
    render() {
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
                        <Button variant="outlined">
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
                        {foldersData.map((folder) => (
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
                        {diagramsData.map((diagram) => (
                            <ItemDiagrama key={diagram.id} item={diagram} />

                        ))}
                    </Stack>
                </div>
            </div>
        );
    }
};
// class Pasta extends Component {
//     state = { details: [] }
//     componentDidMount() {
//         let data;
//         axios.get('api/pastas')
//             .then(res => {
//                 data = res.data;
//                 this.setState({ details: data });
//             })
//             .catch(err => { })
//     }
//     render() {
//         return (
//             <div>
//             <h1>Lista de pastas</h1>
//             {this.state.details.map((pasta, id) => (
//                 <div key={id}>
//                     <div>
//                     <h2>{pasta.nome}</h2>
//                     <h2>{pasta.dono}</h2>
//                     </div>
//                 </div>
//             ))}

//             </div>
//         );
//     }
// };

export default Biblioteca;
