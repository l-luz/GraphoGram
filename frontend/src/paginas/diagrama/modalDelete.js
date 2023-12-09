import React from 'react';
import {
    Modal,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
} from '@mui/material';

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

export default function AlertDialog({cy, setDeleteState, proximoNo}) {
    const open = true;

    const delElements = () => {

        const selEl = cy.$('.modify');
        if (selEl) {
            cy.remove(selEl);
            cy.nodes('[label = "?"][outdegree = 0]').remove();
            proximoNo("del");
        }
        selEl.toggleClass('modify');
        setDeleteState();
    };

    const handleClose = () => {
        const selEl = cy.$('.modify');
        selEl.toggleClass('modify');
        setDeleteState();
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Card sx={style}>
        <CardHeader title="Atenção!!!" />
        <CardContent>
                Ao confirmar todos os itens selecionados e seus respectivos conteúdos do diagrama serão excluídos.
                <br />As transições(arestas) das etapas selecionadas serão apagadas.
                <br />As etapas de dialogo sem nenhuma etapa seguinte serão apagados.
        </CardContent>
        <CardActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={delElements} autoFocus>
                Deletar
            </Button>
        </CardActions>
        </Card>
    </Modal>
);
}
