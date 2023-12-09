import React, { Component } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import {
    Modal,
    Card, CardHeader, CardContent, CardActions,
    Grid,
    FormGroup, FormControl,
    TextField,
    Button,
    Select, MenuItem,
    Radio,
} from '@mui/material';


function InstanciaResposta({ count_resp, resposta, handleChange, IDNos, caminho, handleCaminho }) {

    return (
        <Grid item container xs={12} alignItems="center" >
            <Grid item xs={6} >
                <FormControl>
                    <TextField
                        multiline
                        label={`Resposta ${count_resp}`}
                        type="text"
                        id={`etapa-resposta-${count_resp}`}
                        name="texto"
                        value={resposta.texto}
                        onChange={handleChange}
                        placeholder="Insira a resposta"
                        required
                    />
                </FormControl>
            </Grid>
            <Grid item xs={4}>
                <FormControl>
                    {resposta.readOnly ?
                        <TextField
                            label="ID"
                            type="text"
                            id={`etapa-caminho-${count_resp}`}
                            name="IDNo"
                            value={resposta.label}
                            onChange={handleChange}
                            placeholder="ID"
                            disabled
                        /> :
                        <>
                            <Select
                                type="text"
                                label="ID"
                                id={`etapa-select-${count_resp}`}
                                name="IDNo"
                                value={resposta.IDNo ? resposta.IDNo : ""}
                                onChange={handleChange}
                                placeholder="ID"
                            >
                                {IDNos ? IDNos.map((node) =>
                                    <MenuItem key={node.id} value={node.id}>{node.label}</MenuItem>
                                ) : null}
                            </Select>
                        </>
                    }
                </FormControl>
            </Grid>
            <Grid item xs={1}>
                <Radio
                    placeholder='Caminho'
                    checked={caminho === count_resp - 1}
                    onChange={handleCaminho}
                    value={count_resp - 1}
                    name="radio-buttons"
                    inputProps={{ 'aria-label': resposta.label }}
                />
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

class ModalPergunta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
            count_resp: 1,
        };
    }


    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };

    handleAddResposta = () => {
        const activeItem = { ...this.props.activeItem };
        activeItem.respostas.push({ texto: '', IDNo: 'novoNo', label: '', readOnly: false });
        this.setState({ activeItem, count_resp: this.state.count_resp + 1 });
    };

    render() {
        const { modalOpen } = this.state;
        const { activeItem, nodes, setPergunta, setCaminho } = this.props;
        return (
            <Modal open={modalOpen} onClose={this.toggleModal}>
                <Card sx={style} >
                    <CardHeader title="Adicionar Diálogo na Apresentação" />
                    <CardContent>
                        <Grid container rowSpacing={3} spacing={1}>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <TextField
                                        multiline
                                        label="Pergunta"
                                        type="text"
                                        id="etapa-pergunta"
                                        name="pergunta"
                                        defaultValue={activeItem.pergunta}
                                        onChange={setPergunta}
                                        placeholder="Insira a pergunta"
                                        required
                                    />
                                </FormGroup>
                            </Grid>
                            {activeItem.respostas.map((resposta, index) => (
                                <InstanciaResposta
                                    key={index}
                                    count_resp={index + 1}
                                    resposta={resposta}
                                    IDNos={nodes}
                                    handleChange={(e) => {
                                        const novaResposta = [...activeItem.respostas];
                                        novaResposta[index][e.target.name] = e.target.value;
                                        const newActiveItem = { ...activeItem, respostas: novaResposta };
                                        this.setState({ activeItem: newActiveItem });
                                    }}
                                    handleCaminho={setCaminho}
                                    caminho={activeItem.caminho}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={2} style={{ textAlign: 'right' }}>
                                <Button onClick={this.handleAddResposta}>
                                    <HiOutlinePlus />
                                </Button>
                            </Grid>
                            <Grid item xs={8}></Grid>
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


export default ModalPergunta;
