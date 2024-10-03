import React from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Grid, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { resumeStore } from '../stores/resumeStore';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Review: React.FC = observer(() => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Обзор резюме</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Основная информация</Typography>
        <Typography>Фамилия: {resumeStore.lastName}</Typography>
        <Typography>Имя: {resumeStore.firstName}</Typography>
        <Typography>Отчество: {resumeStore.middleName}</Typography>
        {/* <Typography>Дата рождения: {resumeStore.birthDate}</Typography> */}
        {/* <Typography>Телефон: {resumeStore.phone}</Typography> */}
        {/* <Typography>Email: {resumeStore.email}</Typography> */}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Опыт работы</Typography>
        <List>
          {resumeStore.workExperiences.map((exp, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${exp.company} - ${exp.position}`}
                secondary={`${exp.startDate} - ${exp.endDate}\n${exp.responsibilities}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Образование</Typography>
        <List>
          {resumeStore.educations.map((edu, index) => (
            <ListItem key={index}>
              {/* <ListItemText
                primary={`${edu.institution} - ${edu.degree}`}
                secondary={`${edu.startDate} - ${edu.endDate}`}
              /> */}
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Навыки</Typography>
        {/* <Typography>{resumeStore.skills.join(', ')}</Typography> */}
      </Grid>
      <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}  className="no-print">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button variant="contained" onClick={handlePrint}>
              Печать
            </Button>
          </Box>
        </Grid>
    </Grid>
  );
});

export default Review;
