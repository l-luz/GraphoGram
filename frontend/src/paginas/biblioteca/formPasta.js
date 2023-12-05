import React, {useState } from 'react';
import {
    Modal,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    FormGroup,
    TextField,
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

const AddPasta = (props) => {
    const [state, setState] = useState({
        activeItem: props.activeItem,
        modalOpen: true,
        pastaAdd: { descendente: '', nome: '' }
    });

    const toggleModal = () => {
        setState({ ...state, modalOpen: !state.modalOpen });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            activeItem: { ...prevState.activeItem, [name]: value }
        }));
    };

    const { activeItem, modalOpen } = state;

    return (
        <Modal open={modalOpen} onClose={toggleModal}>
            <Card sx={style}>
                <CardHeader title="Nova Pasta" />
                <CardContent>
                    <FormGroup>
                        <TextField
                            type="text"
                            label="Nome"
                            id="pasta-nome"
                            name="nome"
                            value={activeItem.pastaAdd}
                            onChange={handleChange}
                            placeholder="Insira o nome da pasta"
                            required
                        />
                    </FormGroup>
                </CardContent>
                <CardActions>
                    <Button color="success" onClick={() => props.onSave(activeItem)}>
                        Save
                    </Button>
                </CardActions>
                <div className="modal-overlay" onClick={toggleModal}></div>
            </Card>
        </Modal>
    );
};

// class AddPasta extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             activeItem: props.activeItem,
//             modalOpen: true,
//             pastaAdd: { descendente: '', nome: '' }
//         }
//     }
//     toggleModal = () => {
//         this.setState({ modalOpen: !this.state.modalOpen });
//     };


//     handleChange = (e) => {
//         const { name, value } = e.target;
//         this.setState((prevState) => ({
//             activeItem: { ...prevState.activeItem, [name]: value }
//         }));
//     };
    

//     render() {
//         const { activeItem,  modalOpen } = this.state;

//         return (
//             <Modal open={modalOpen} onClose={this.toggleModal} >
//                 <Card sx={style}>
//                 <CardHeader toggle={this.toggleModal} title="Nova Pasta" />
//                 <CardContent>
//                         <FormGroup>
//                             <TextField
//                                 type="text"
//                                 label="Nome"
//                                 id="pasta-nome"
//                                 name="nome"
//                                 value={activeItem.pastaAdd}
//                                 onChange={this.handleChange}
//                                 placeholder="Insira o nome da pasta"
//                                 required
//                             />
//                         </FormGroup>
//                 </CardContent>
//                 <CardActions>
//                     <Button color="success" onClick={() => this.props.onSave(activeItem)}>
//                         Save
//                     </Button>
//                 </CardActions>
//                 <div className="modal-overlay" onClick={this.toggleModal}></div>
//                 </Card>
//             </Modal>
//         );
//     }
// };

export default AddPasta;
