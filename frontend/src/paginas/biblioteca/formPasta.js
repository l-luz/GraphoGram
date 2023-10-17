import React, {Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

class AddPasta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            activeItem: props.activeItem,
            modalOpen: true,
            modalRef: null,
            pastaAdd: { descendente: '', nome: '' }
        }
    }
    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };


    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            activeItem: { ...prevState.activeItem, [name]: value }
        }));
    };
    

    render() {
        const { activeItem,  modalOpen, modalRef, id} = this.state;

        return (
            <Modal isOpen={modalOpen} toggle={this.toggleModal} innerRef={modalRef}>
                <ModalHeader toggle={this.toggleModal}>Nova Turma {id} </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="pasta-nome">Nome</Label>
                            <Input
                                type="text"
                                id="pasta-nome"
                                name="nome"
                                value={activeItem.pastaAdd}
                                onChange={this.handleChange}
                                placeholder="Insira o nome da pasta"
                            />
                        </FormGroup>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => this.props.onSave(activeItem)}>
                        Save
                    </Button>
                </ModalFooter>
                <div className="modal-overlay" onClick={this.toggleModal}></div>
            </Modal>
        );
    }
};

export default AddPasta;
