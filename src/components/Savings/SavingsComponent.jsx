import React from 'react';
import { Container, CircularProgress, Grid, Box } from '@mui/material';
import styles from './SavingsComponent.module.css';
import SavingAreaCard from './SavingsAreaCard';
import useFetchWithToken from '../../firebase/useFetchWithToken';

const SavingsComponent = () => {
    // Use authenticated API call
    const { data: savingAreas, loading, error } = useFetchWithToken('http://127.0.0.1:8000/api/saving_areas/?ordering=priority');

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <p>Error loading savings data</p>
            </Container>
        );
    }

    return (
        <div className={styles.scrollableList}>
            <Grid container spacing={2}>
                {savingAreas?.map((savingArea) => (
                    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={savingArea.id}>
                        <SavingAreaCard savingArea={savingArea} />
                    </Box>
                ))}
            </Grid>
        </div>
    );
};

export default SavingsComponent;
