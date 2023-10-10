import { useState } from "react";
import { Button, Card, FloatingLabel, Form } from "react-bootstrap";

export function AddDisciplina(props) {

    function getDisciplinaVazia() {
        return {
            codigo: '',
            nome: '',
        }
    }

    const [disciplina, setDisciplina] = useState(getDisciplinaVazia);

    function handleSubmit(e) {
        e.preventDefault();
        props.handleAddDisciplina(disciplina);
        setDisciplina(getDisciplinaVazia());
    }

    function handleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setDisciplina(oldDisciplina => ({
            ...oldDisciplina,
            [name]: value
        }));
    }

    return (
        <section className="input_section">
            <Card>
                <Card.Header>
                    Nova Disciplina
                </Card.Header>
                <Card.Body className="card-body">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <FloatingLabel label="Title">
                                <Form.Control id="inputBookTitle"
                                    type="text"
                                    name="title"
                                    value={disciplina.codigo}
                                    onChange={handleChange}
                                    required />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="form-floating mt-2">
                            <FloatingLabel label="Author">
                                <Form.Control type="text"
                                    name="author"
                                    value={disciplina.nome}
                                    onChange={handleChange}
                                    required />
                            </FloatingLabel>
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary"
                                type="submit">
                                Save
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </section >
    )
}