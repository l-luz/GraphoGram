import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({cy, setDeleteState, proximoNo}) {
    const [open, setOpen] = React.useState(true);

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
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={delElements} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
