import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import axios from "axios";

const DeleteItem = ({item, deleteDial, handleClose, deleted}) => {
    const delItem = () => {
        // console.log(item);
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
        if (item.titulo){
            axios
                .delete(`/api/diagramas/${item.id}/`)
                .catch((error) => {
                    console.error('Erro ao deletar diagrama:', error);
                });
        } else {
            axios
            .delete(`/api/pastas/${item.id}/`)
            .catch((error) => {
                console.error('Erro ao deletar pasta:', error);
            });
        }
        deleted();
    };

    return (
        <div>
            <Dialog
                open={deleteDial}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Atenção!!!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tem certeza que deseja deletar o item {item.nome || item.titulo}? <br />
                        {item.nome ? 
                            (
                                <> 
                                Esta pasta pode conter outras pastas ou diagramas armazenados. <br />
                                Todos eles serão apagados juntos.
                                </>
                            ) : null
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={delItem} autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteItem;