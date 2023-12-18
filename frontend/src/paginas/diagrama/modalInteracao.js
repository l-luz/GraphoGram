import React, { Component } from 'react';
import {
        Modal,
        Card, CardHeader, CardContent,
        Grid,
        FormControl,
        Button,
} from "@mui/material"

function ModalOpcao({ count_resp, resposta, proximoNo, toggleModal }) {
    const handleClick = (event, id) => {
        event.preventDefault();
        // console.log(id);
        proximoNo(id);
        toggleModal();
    };

    return (
        <Grid item xs={4}>
            <FormControl>
                <Button
                    id={`dialogo-resposta-${count_resp}`}
                    color="secondary"
                    fullWidth={true}
                    variant="contained"
                    onClick={(event) => {
                        handleClick(event, resposta.IDNo);
                    }}
                >
                    {resposta.texto}
                </Button>
            </FormControl>
        </Grid>
    );
}

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

class ModalInteracao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
            count_resp: 1,
        };
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
        this.props.interacaoOpen();
        
    };

    render() {
        const { modalOpen } = this.state;
        const { etapaAtual, proximoNo } = this.props;

        return (
            <Modal open={modalOpen} onClose={this.toggleModal}>
                <Card sx={style}>
                    <CardHeader title={etapaAtual.data("pergunta")} />
                    <CardContent>
                        <Grid container rowSpacing={3} spacing={1}>
                            {etapaAtual.data("respostas") ? etapaAtual.data("respostas").map((resposta, index) => (
                                <ModalOpcao
                                    key={index}
                                    count_resp={index + 1}
                                    resposta={resposta}
                                    proximoNo={proximoNo}
                                    toggleModal={this.toggleModal}
                                />
                            )) : null}
                        </Grid>
                    </CardContent>
                </Card>
            </Modal>
        );
    }
}

export default ModalInteracao;
