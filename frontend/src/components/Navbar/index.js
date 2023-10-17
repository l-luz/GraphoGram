import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
const Navbar = () => {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('access_token') !== null && localStorage.getItem('access_token') !== "undefined") {
            setIsAuth(true);
        } else {
            if (window.location.href !== "http://localhost:3000/login" && window.location.href!=="http://localhost:3000/erro401"){
                window.location.href = '/erro401'
            }
        }
    }, [isAuth]);

    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                {isAuth ?
                    <Toolbar sx={{ flexWrap: 'wrap' }}>
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Company name
                        </Typography>

                        <nav>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/pastas"
                                sx={{ my: 1, mx: 1.5 }}

                            >
                                Pastas
                            </Link>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/config"
                                sx={{ my: 1, mx: 1.5 }}

                            >
                                Configurações
                            </Link>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/diagrama"
                                sx={{ my: 1, mx: 1.5 }}

                            >
                                Diagrama
                            </Link>
                            <Link
                                variant="button"
                                color="text.primary"
                                href="/turma"
                                sx={{ my: 1, mx: 1.5 }}

                            >
                                Turma
                            </Link>

                        </nav>
                        <Link href="/logout">Logout</Link>


                    </Toolbar>
                    :
                    <Toolbar sx={{ flexWrap: 'wrap' }}>
                        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                            Company name
                        </Typography>

                        {/* <Button
                            href="/login"
                            variant="outlined"
                            sx={{ my: 1, mx: 1.5 }}
                        > Login </Button> */}
                    </Toolbar>


                }
            </AppBar>
        </>
    )
}

export default Navbar;