import React from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Grid, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { resumeStore } from '../stores/resumeStore';
import { useNavigate } from 'react-router-dom';

const Review: React.FC = observer(() => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  console.log('resumeStore', resumeStore)
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Обзор резюме</Typography>
      </Grid>
      <Grid item xs={12}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Box
          sx={{
            width: '100%',
            height: '300px',
            overflow: 'hidden',
            marginBottom: 2,
          }}
        >
          <img
            src={resumeStore.photo}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Grid>
        <Typography variant="h6">Основная информация</Typography>
        <Typography>Фамилия: {resumeStore.lastName}</Typography>
        <Typography>Имя: {resumeStore.firstName}</Typography>
        <Typography>Отчество: {resumeStore.middleName}</Typography>
        <Typography>Город: {resumeStore.city}</Typography>
        <Typography>Дата рождения: {resumeStore.birthDate?.toLocaleDateString()}</Typography>
        <Typography>Пол: {resumeStore.gender}</Typography>
        <Typography>Гражданство: {resumeStore.citizenship}</Typography>
        <Typography>Желаемая должность: {resumeStore.desiredPosition}</Typography>
        <Typography>Зарплата: {resumeStore.salary} {resumeStore.currency}</Typography>
        <Typography>О себе: {resumeStore.aboutMe}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Опыт работы</Typography>
        {resumeStore.hasWorkExperience ? (
          <List>
            {resumeStore.workExperiences.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${exp.company} - ${exp.position}`}
                  secondary={`${exp.startDate?.toISOString().split('T')[0]} - ${exp.endDate ?? 'По настоящее время'}`}
                />
                <ListItemText
                  primary={`Обязанности:`}
                  secondary={`${exp.responsibilities}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Нет опыта работы</Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Образование</Typography>
        <Typography>Уровень образования: {resumeStore.educationLevel}</Typography>
        <List>
          {resumeStore.educations.map((edu, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${edu.institution} - ${edu.specialization}`}
                secondary={`${edu.graduationYear?.toISOString().split('T')[0]}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Языки</Typography>
        <Typography>Родной язык: {resumeStore.nativeLanguage}</Typography>
        <Typography variant="subtitle1">Иностранные языки:</Typography>
        <List>
          {resumeStore.foreignLanguages.map((lang, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${lang.language} - ${lang.level}`}
              />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }} className="no-print">
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
