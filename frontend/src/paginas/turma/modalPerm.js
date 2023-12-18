import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Chip,
    Grid,
    Checkbox
} from '@mui/material';
import axios from "axios";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 725,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


const Permissoes = ({ turma_id, show, handleClose }) => {
    const [comPerm, setComPerm] = useState(null);
    const [semPerm, setSemPerm] = useState(null);
    const getPerms = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        await axios
            .get(`/api/permissoes/${turma_id}/`)
            .then((res) => { setComPerm(res.data.configurados); setSemPerm(res.data.diagramas); console.table(res.data.configurados); console.table(res.data.diagramas) })
            .catch((err) => console.error("Erro ao recuperar permissões", err))
    };

    useEffect(() => {
        if (turma_id) {
            getPerms();
        }
    }, [turma_id])

    return (
        <div>
            <Dialog
                open={show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Permissões:"}
                </DialogTitle>
                <DialogContent sx={style}>
                    {comPerm ? comPerm.map((item) =>
                        <Grid Container >
                            <Grid item xs={4} >
                                <Chip label={`${item.titulo}`} />
                            </Grid>
                            <Grid item xs={3}>

                            </Grid>
                            <Grid item xs={3}>

                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                        </Grid>

                    ) : null}
                    {semPerm ? semPerm.map((item) =>
                        <Grid Container >
                            <Grid item xs={4} >
                                <Chip label={`${item.titulo}`} />
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker label="Disponibilização" />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={3}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker label="Validade" />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={1}>
                                <Checkbox></Checkbox>
                            </Grid>
                        </Grid>

                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Permissoes;