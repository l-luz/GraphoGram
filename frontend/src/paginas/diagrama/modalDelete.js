import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
export default function AlertDialog({cy, setDeleteState, proximoNo}) {
    const [open, setOpen] = useState(true);

    const delElements = () => {

        const selEl = cy.$('.modify');
        if (selEl) {
            cy.remove(selEl);
            //todo att if ?
            cy.Nodes('[label = "?"][outdegree = 0]').remove();
            proximoNo(undefined);
        }
        selEl.toggleClass('modify');
        setDeleteState(false);
    };

    const handleClose = () => {
        const selEl = cy.$('.modify');
        selEl.toggleClass('modify');
        setOpen(false);
        setDeleteState(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Atenção!!!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao confirmar todos os itens selecionados e seus respectivos conteúdos do diagrama serão excluídos.
                        <br />As transições(arestas) das etapas selecionadas serão apagadas.
                        <br />As etapas de dialogo sem nenhuma etapa seguinte serão apagados.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={delElements} autoFocus>
                        Deletar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
