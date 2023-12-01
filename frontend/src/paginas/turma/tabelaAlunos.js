import React, { useEffect } from 'react';
import axios from "axios";
import {
    Box,
    Button
} from '@mui/material';
import {
    MdAdd,
    MdEdit,
    MdDeleteOutline,
    MdSave,
    MdOutlineCancel
} from "react-icons/md";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = Date.now(); // Usando um timestamp como ID único
        setRows((oldRows) => [...oldRows, { id: id, aluno_id: '' ,nome: '', username: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nome' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<MdAdd />} onClick={handleClick}>
                Add Aluno
            </Button>
        </GridToolbarContainer>
    );
}

export default function FullFeaturedCrudGrid({ turma_id }) {

    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const recuperaAlunosTurma = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
        axios
            .get(`/api/turmas/${turma_id}/participantes/`)
            .then((res) => {setRows(res.data.participantes)}) // 
            .catch((err) => console.error('Erro ao recuperar alunos da turma: ', turma_id, err));
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    
    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const submit = (row) => {
        if (!row.isNew) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
            console.log("update")
            axios.put(`/api/usuarios/${row.aluno_id}/update_participante/`, {aluno: row})
        } else {
            const participante = {
                aluno: row,
                turma_id: turma_id
            }    
            console.log("create")
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
            axios.post(`/api/participantes/create_aluno/`, participante)
                .then((response) => {
                    console.log('Resposta do POST:', response.data);

                    // Atualize o ID no frontend com o ID retornado pelo backend
                    const novoId = response.data.id;
                    row.aluno_id = novoId;

                    // Faça o que precisar com o novo ID no frontend
                    console.log('ID atualizado no frontend:', novoId);
                })
                .catch((err) => console.error('Erro ao adicionar aluno:', err));
        }

    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`; // salva o token no header das requisições
        axios.delete(`/api/participantes/${id}`)
        .then((response) => {
            console.log('Resposta do delete:', response.data);
        })
        .catch((err) => console.error('Erro ao deletar aluno:', err));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        console.log(rowModesModel)
        submit(newRow);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'nome',
            headerName: 'Nome',
            width: 250,
            editable: true
        },
        {
            field: 'username',
            headerName: 'Matrícula',
            width: 100,
            editable: true
        },
        // {
        //     field: 'joinDate',
        //     headerName: 'Acesso',
        //     type: 'date',
        //     width: 110,
        //     editable: false,
        // },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ação',
            width: 60,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<MdSave />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<MdOutlineCancel />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<MdEdit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<MdDeleteOutline />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];


    useEffect(() => {
        if (turma_id){
            recuperaAlunosTurma();
        }
        else {
            setRows([]);
        }
    }, [turma_id]);



    return (
        <Box
            sx={{
                height: 400,
                width: '60%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}
