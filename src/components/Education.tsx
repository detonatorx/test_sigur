import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Select, MenuItem, IconButton, Box, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { resumeStore } from '../stores/resumeStore';

const Education: React.FC = observer(() => {
  const navigate = useNavigate();
  const [foreignLanguage, setForeignLanguage] = useState({ language: '', level: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateEducation(name as string, value as string);
  };

  const handleAddForeignLanguage = () => {
    resumeStore.addForeignLanguage(foreignLanguage);
    setForeignLanguage({ language: '', level: '' });
  };

  const handleAddEducation = () => {
    resumeStore.addEducation({
      level: '',
      institution: '',
      faculty: '',
      specialization: '',
      graduationYear: '',
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add validation here
    navigate('/review');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Select
            fullWidth
            name="educationLevel"
            value={resumeStore.educationLevel}
            onChange={handleChange}
            required
          >
            <MenuItem value="secondary">Среднее</MenuItem>
            <MenuItem value="vocational">Среднее специальное</MenuItem>
            <MenuItem value="higher">Высшее</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="nativeLanguage"
            label="Родной язык"
            value={resumeStore.nativeLanguage}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="language"
            label="Иностранный язык"
            value={foreignLanguage.language}
            onChange={(e) => setForeignLanguage({ ...foreignLanguage, language: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="level"
            label="Уровень владения"
            value={foreignLanguage.level}
            onChange={(e) => setForeignLanguage({ ...foreignLanguage, level: e.target.value })}
          />
          <Button onClick={handleAddForeignLanguage} startIcon={<AddIcon />}>
            Добавить язык
          </Button>
        </Grid>
        {resumeStore.foreignLanguages.map((lang, index) => (
          <Grid item xs={12} key={index}>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                value={`${lang.language} - ${lang.level}`}
                InputProps={{ readOnly: true }}
              />
              <IconButton onClick={() => resumeStore.removeForeignLanguage(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
        {resumeStore.educations.map((edu, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name={`institution-${index}`}
                label="Название учебного заведения"
                value={edu.institution}
                onChange={(e) => resumeStore.updateEducationField(index, 'institution', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name={`faculty-${index}`}
                label="Факультет"
                value={edu.faculty}
                onChange={(e) => resumeStore.updateEducationField(index, 'faculty', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name={`specialization-${index}`}
                label="Специализация"
                value={edu.specialization}
                onChange={(e) => resumeStore.updateEducationField(index, 'specialization', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name={`graduationYear-${index}`}
                label="Год окончания"
                value={edu.graduationYear}
                onChange={(e) => resumeStore.updateEducationField(index, 'graduationYear', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddEducation} startIcon={<AddIcon />}>
            Добавить место обучения
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button variant="contained" type="submit">
              Далее
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
});

export default Education;
