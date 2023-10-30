import React, { Component } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import {
        Modal,
        Card,
        CardHeader,
        CardContent,
        CardActions,
        Grid,
        FormGroup,
        FormControl,
        TextField,
        Button,
        Select,
        MenuItem,
} from "@mui/material"
const buttonStyle = {
    whiteSpace: 'normal',
    textTransform: 'none',
    textAlign: 'center',
    lineHeight: 1.2
};

function ModalOpcao({ count_resp, resposta }) {

    return (
        <Grid item container xs={12} alignItems="center" spacing={1}>
            <Grid item xs={4} >
                <FormControl>
                    <Button
                        id={`dialogo-resposta-${count_resp}`}
                        color="secondary"
                        fullWidth={true}
                        variant="contained"
                    >
                        {resposta.texto}
                        {resposta.IDNo}
                    </Button>
                </FormControl>
            </Grid>
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
            modalRef: null,
            count_resp: 1,
        };
    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    render() {
        const { modalOpen } = this.state;
        const { activeItem, nodes } = this.props;

        return (
            <Modal open={modalOpen} onClose={this.toggleModal}>
                <Card sx={style}>
                    <CardHeader title={this.props.activeItem.pergunta} />
                    <CardContent>
                        <Grid container rowSpacing={3} spacing={1}>
                            {activeItem.respostas.map((resposta, index) => (
                                <ModalOpcao
                                    key={index}
                                    count_resp={index + 1}
                                    resposta={resposta}
                                    IDNos={nodes}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Button color="success" onClick={() => this.props.onSave(activeItem)}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Modal>
        );
    }
}

export default ModalInteracao;
