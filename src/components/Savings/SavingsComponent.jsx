import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import axios from 'axios';
import styles from './SavingsComponent.module.css';
import SavingAreaCard from './SavingsAreaCard';

const SavingsComponent = () => {
    const [savingAreas, setSavingAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/saving_areas/?ordering=priority')
            .then((response) => {
                console.log('rea', response.data);
                setSavingAreas(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <div className={styles.scrollableList}>
            <Grid container spacing={2}>
                {savingAreas.map((savingArea) => (
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} key={savingArea.id}>
                        <SavingAreaCard savingArea={savingArea} />
                    </List>
                ))}
            </Grid>
        </div>
    );
};

export default SavingsComponent;
