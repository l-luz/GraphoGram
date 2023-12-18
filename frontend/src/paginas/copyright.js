import React from 'react';
import {
    Typography,
    Grid
} from '@mui/material/';


export default function Copyright(props) {
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" align="justify" {...props}>
                        {'Copyright © '} 2016-2023, The Cytoscape Consortium.
                    </Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="body2" color="text.secondary" align="justify" {...props}>
                        {'Copyright © '} 2020 Excalidraw
                    </Typography>

                </Grid>
            </Grid>
        </>
    );
}
