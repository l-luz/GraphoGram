import React, { useState } from 'react';
import {
    Modal,
    Select, Autocomplete, MenuItem,
    TextField, InputLabel,
    FormControl, FormGroup,
    Card, CardHeader, CardContent, CardActions, Grid,
    Tooltip,
    Button,
} from '@mui/material';
import InputFileUpload from "../../components/fileUpload";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddTurma = (props) => {
    const { optDisciplinas } = props;

    const [activeItem, setActiveItem] = useState({
        disciplina: '',
        codigo: '',
        ano: '',
        periodo: '',
        file: null,
    });

    const [modalOpen, setModalOpen] = useState(true);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleChange = (e, id) => {
        if (e === "disciplina"){
            setActiveItem({ ...activeItem, ["disciplina"]: id });
        }else{
            const { name, value } = e.target;
            setActiveItem({ ...activeItem, [name]: value });
        }
    };

    const handleFileContentChange = (fileContent) => {      
        setActiveItem({...activeItem, file: fileContent});
    };


    return (
        <Modal open={modalOpen} onClose={toggleModal}>
            <Card sx={style}>
                <CardHeader title="Nova Turma" />
                <CardContent>
                    <Grid container spacing={1} rowSpacing={3}>
                        <Grid item xs={6} >
                            <FormControl>
                                <Autocomplete
                                    disablePortal
                                    id="disciplina-list"
                                    name="disciplina"
                                    options={optDisciplinas}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Disciplinas" />}
                                    getOptionLabel={(option) => option.codigo + ' - ' + option.nome}
                                    onChange={(e, val) => {handleChange("disciplina", val.id)}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormGroup>
                                <TextField
                                    id="turma-turma"
                                    label="Turma"
                                    name="codigo"
                                    variant='outlined'
                                    value={activeItem.turma}
                                    onChange={handleChange}
                                    placeholder="Ex. 3wA"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                            <FormGroup>
                                <TextField
                                    type="text"
                                    id="turma-ano"
                                    name="ano"
                                    label="Ano"
                                    value={activeItem.ano}
                                    onChange={handleChange}
                                    placeholder='Ex. 2023'
                                />
                            </FormGroup>

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="turma-periodo-label">Periodo</InputLabel>
                                <Tooltip title="Relativo ao primeiro ou Segundo semestre do ano.">
                                <Select
                                    labelId="turma-periodo-label"
                                    id="turma-periodo"
                                    value={activeItem.periodo}
                                    name="periodo"
                                    label="Periodo"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                </Select>
                                </Tooltip>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormGroup>
                                <InputFileUpload onFileContentChange={handleFileContentChange} />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button color="success" onClick={() => props.onSave(activeItem)}>
                        Save
                    </Button>
                </CardActions>
            </Card>
        </Modal>
    );
};

export default AddTurma;
