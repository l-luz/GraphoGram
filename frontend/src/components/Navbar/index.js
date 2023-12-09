import React, { useState, useEffect } from 'react';
import {
    AppBar, 
    Toolbar, 
    Chip, 
    Typography, 
    Link
} from '@mui/material';
import axios from "axios";
const Navbar = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [userInfo, setUserInfo] = useState({
        tipo: '',
        nome: '',
    });

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== "undefined") {
            setIsAuth(true);
        } else {
            if (window.location.href !== "http://localhost:3000/login" && window.location.href !== "http://localhost:3000/erro401") {
                window.location.href = '/erro401'
            }
        }
    }, [isAuth]);

    useEffect(() => {
        const getUser = async () => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("access_token")}`;
            await axios
                .get('/api/usuarios/usuario_info/')
                .then((resp) => { setUserInfo({tipo: resp.data.tipo, nome: resp.data.nome}) })
                .catch((err) => console.error("Erro ao recuperar tipo do usuário", err));
        }
        getUser();
    }, []);


    return (
        <>
            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                {isAuth ?
                    <Toolbar sx={{ flexWrap: 'wrap' }} >
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Graphogram
                        </Typography>

                        <nav>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/pastas"
                                sx={{ my: 1, mx: 1.5 }}
                            >
                                Biblioteca
                            </Link>
                            {
                                userInfo.tipo === "professor" ? (
                                    <>
                                        <Link
                                            variant="button"
                                            color="text.primary"
                                            href="/diagrama"
                                            sx={{ my: 1, mx: 1.5 }}
                                        > Diagrama </Link>
                                        <Link
                                            variant="button"
                                            color="text.primary"
                                            href="/turma"
                                            sx={{ my: 1, mx: 1.5 }}
                                        > Turma</Link>

                                    </>
                                ) : null
                            }
                        </nav>
                        
                        <Chip label={`Olá, ${userInfo.nome}!`} style={{ marginLeft: '5px', marginRight: '5px' }} variant="outlined" color="secondary" />
                        
                        <Link href="/logout" sx={{ my: 1, mx: 1.5 }}>Logout</Link>


                    </Toolbar>
                    :
                    <Toolbar sx={{ flexWrap: 'wrap' }}>
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Graphogram
                        </Typography>
                    </Toolbar>


                }
            </AppBar>
        </>
    )
}

export default Navbar;