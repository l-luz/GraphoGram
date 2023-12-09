import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { TbPlus } from "react-icons/tb";
import {
    Stack, Paper, Grid, Link, Button,
    IconButton, Menu, MenuItem,
    Tooltip,
} from '@mui/material';
import AddPasta from './formPasta';
import DeleteItem from './modalDelete'

function ItemPasta({ item, refresh }) {
    const [deleteDial, setDeletDial] = useState(false);
    const handleDelete = () => {
        setDeletDial(!deleteDial);
    };

    const handleClose = () => {
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
            {deleteDial ?
                (
                    <DeleteItem item={item} deleteDial={deleteDial} handleClose={handleClose} deleted={deleted} />
                ) : null
            }

            <Grid container spacing={1} justifyContent="space-between">
                <Grid item xs={9}>
                    <Button href={`/pastas/${item.id}`} >
                        {item.nome}
                    </Button>
                </Grid>
                <Grid item xs={2} >
                    <Button onClick={handleDelete}>
                        <FiTrash2 />
                    </Button>
                </Grid>
            </Grid>

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
                    <Tooltip tittle={item.descricao}>
                        <Link href={`diagrama/${item.id}`} color="inherit" underline="none">
                            {item.titulo}
                        </Link>
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
            {deleteDial ?
                (
                    <DeleteItem item={item} deleteDial={deleteDial} setDeletDial={setDeletDial} />
                ) : null
            }
        </Paper>
    );
}


// class Biblioteca extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             modal: false,
//             pastas: [],
//             diagramas: [],
//             id: "",
//             activeItem: {
//                 nome: ""
//             },
//         };
//     }

//     refreshList = () => {
//         axios
//             .get(`/api/pastas/${this.state.id}`)
//             .then((res) => {
//                 this.setState({
//                     pastas: res.data.pastas,
//                     diagramas: res.data.diagramas
//                 });
//             })
//             .catch((err) => console.log(err));
//     };

//     componentDidMount() {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
//         const path = window.location.href.split('/');
//         let pageId = Number(path[path.length - 1]);
//         if (isNaN(pageId)) {
//             pageId = '';
//         }

//         this.setState({ id: pageId }, () => {
//             this.refreshList();
//         });

//     }

//     toggle = () => {
//         this.setState({ modal: !this.state.modal });
//     };

//     handleSubmit = (item) => {
//         this.toggle();
//         axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
//         item["descendente"] = this.state.id;

//         if (item.id) {
//             axios
//                 .put(`/api/pastas/${item.id}/`, item)
//                 .then((res) => this.refreshList());
//             return;
//         }
//         axios
//             .post("/api/pastas/", item)
//             .then((res) => this.refreshList());
//         console.log("adicionando pasta");

//     };

//     criarItem = () => {
//         const item = {
//             nome: ""
//         };

//         this.setState({ activeItem: item, modal: !this.state.modal });
//     };

//     render() {
//         const { pastas, diagramas } = this.state;
//         return (
//             <>
//                 <Grid container alignItems="center">
//                     <Grid item xs={6}>
//                         <h1 style={{ marginlE: '20' }}>Biblioteca</h1>
//                     </Grid>
//                     {/* <Grid item xs={2}>
//                         <Button variant="outlined" onClick={this.criarItem}>
//                             <TbPlus size={20} /> Nova Pasta
//                         </Button>
//                     </Grid> */}
//                 </Grid>
//                 {pastas ? (
//                     <div className="pastas" >
//                         <h2 style={{ marginlE: '20' }}>Pastas</h2>
//                         <Stack
//                             className="folder-list"
//                             marginTop={5}
//                             marginBottom={8}
//                             marginLeft={5}
//                             spacing={{ xs: 1, sm: 5 }}
//                             direction="row"
//                             useFlexGap
//                             flexWrap="wrap"
//                         >
//                             {pastas ? pastas.map((folder) => (
//                                 <ItemPasta key={folder.id} item={folder} refresh={this.refreshList} />
//                             )) : null}
//                         </Stack>
//                     </div>
//                 ) : null}
//                 <hr />
//                 {diagramas ? (
//                     <div className="diagramas">
//                         <h2 style={{ marginlE: '20' }}>Diagramas</h2>
//                         <Stack
//                             className="diagram-list"
//                             marginTop={5}
//                             marginLeft={5}
//                             spacing={{ xs: 1, sm: 5 }}
//                             direction="row"
//                             useFlexGap
//                             flexWrap="wrap"
//                         >
//                             {diagramas ? diagramas.map((diagram) => (
//                                 <ItemDiagrama key={diagram.id} item={diagram} refresh={this.refreshList} />
//                             )) : null}
//                         </Stack>
//                     </div>
//                 ) : null}
//                 {this.state.modal ? (
//                     <AddPasta
//                         activeItem={this.state.activeItem}
//                         toggle={this.toggle}
//                         onSave={this.handleSubmit}
//                     />
//                 ) : null}
//             </>
//         );
//     }
// };


const Biblioteca = (props) => {
    const [modal, setModal] = useState(false);
    const [pastas, setPastas] = useState([]);
    const [diagramas, setDiagramas] = useState([]);
    const [id, setId] = useState('');
    const [activeItem, setActiveItem] = useState({nome: ''});

    const refreshList = () => {
        if (id) {
            axios
            .get(`/api/pastas/${id}`)
            .then((res) => {
                setPastas(res.data.pastas);
                setDiagramas(res.data.diagramas);
            })
            .catch((err) => console.log(err));

        }
    };

    useEffect (() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        const path = window.location.href.split('/');
        let pageId = Number(path[path.length - 1]);
        if (isNaN(pageId)) {
            pageId = '';
        }
        setId(pageId);
        refreshList();
    }, []);

    const toggle = () => {
        setModal(!modal);
    };

    const handleSubmit = (item) => {
        toggle();
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        item["descendente"] = id;

        if (item.id) {
            axios
                .put(`/api/pastas/${item.id}/`, item)
                .then((res) => refreshList());
            return;
        }
        axios
            .post("/api/pastas/", item)
            .then((res) => refreshList());
        console.log("adicionando pasta");
    };

    const criarItem = () => {
        const item = {
            nome: ""
        };
        setActiveItem(item);
        setModal(!modal);
    };

        return (
            <>
                <Grid container alignItems="center">
                    <Grid item xs={6}>
                        <h1 style={{ marginlE: '20' }}>Biblioteca</h1>
                    </Grid>
                    {/* <Grid item xs={2}>
                        <Button variant="outlined" onClick={criarItem}>
                            <TbPlus size={20} /> Nova Pasta
                        </Button>
                    </Grid> */}
                </Grid>
                {pastas ? (
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
                            {pastas ? pastas.map((folder) => (
                                <ItemPasta key={folder.id} item={folder} refresh={this.refreshList} />
                            )) : null}
                        </Stack>
                    </div>
                ) : null}
                <hr />
                {diagramas ? (
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
                            {diagramas ? diagramas.map((diagram) => (
                                <ItemDiagrama key={diagram.id} item={diagram} refresh={this.refreshList} />
                            )) : null}
                        </Stack>
                    </div>
                ) : null}
                {modal ? (
                    <AddPasta
                        activeItem={activeItem}
                        toggle={toggle}
                        onSave={handleSubmit}
                    />
                ) : null}
            </>
        );
};


export default Biblioteca;
