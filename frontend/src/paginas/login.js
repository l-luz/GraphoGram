import React, { useState } from 'react';
import {
    Alert,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Paper,
    Box,
    Grid,
    Typography,
    createTheme,
    ThemeProvider,
} from '@mui/material/';
import { AiOutlineLock } from 'react-icons/ai';
import axios from "axios";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '} 2016-2023, The Cytoscape Consortium.
        <br />
        {'Copyright © '} 2020 Excalidraw
        </Typography>
    );
}

const defaultTheme = createTheme();

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const enviarLogin = async e => {
        e.preventDefault();
        const user = {
            username: username,
            password: password
        };

        try {
            const { data } = await
            axios.post('/api/login/',
                user, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
            );


            localStorage.clear();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            axios.defaults.headers.common['Authorization'] =
                `Bearer ${data['access']}`; 

                window.location.href = '/';
                setError(false);
        } catch {
            console.error('Erro ao fazer login. Credenciais inválidas.');
            setError(true);
        }
        
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            { error ? (
            <Alert severity="error" onClose={() => {setError(false)}}>Login ou senha incorretos!</Alert>

            ) : null }

            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AiOutlineLock />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={enviarLogin} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="matricula"
                                label="Matrícula"
                                name="matricula"
                                autoComplete="matricula"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Login;