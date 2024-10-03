import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Select, MenuItem, IconButton, Box, SelectChangeEvent, Typography, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IForeignLanguage, resumeStore } from '../stores/resumeStore';

interface ILanguageProps {
  index: number;
  fieldErrors: Record<string, boolean>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const LanguageFields: React.FC<ILanguageProps> = observer(({ index, fieldErrors, setFieldErrors }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateForeignLanguage(index, name as keyof IForeignLanguage, value);
  }

  const handleDelete = () => {
    resumeStore.removeForeignLanguage(index);
  };

  console.log('resumeStore.foreignLanguages', resumeStore.foreignLanguages)
  return (
    <>
      <Grid item xs={6}>
        <TextField
          fullWidth
          name="language"
          label="Иностранный язык"
          value={resumeStore.foreignLanguages[index].language}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={resumeStore.foreignLanguages.length > 1 ? 5 : 6}>
        <Select
          labelId="currency-label"
          name="level"
          value={resumeStore.foreignLanguages[index].level}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="start">Начальный</MenuItem>
          <MenuItem value="middle">Средний</MenuItem>
          <MenuItem value="high">Высокий</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={handleDelete} color="error">
          {resumeStore.foreignLanguages.length > 1 && <DeleteIcon />}
        </IconButton>
      </Grid>
    </>
  );
});

const Education: React.FC = observer(() => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [foreignLanguage, setForeignLanguage] = useState({ language: '', level: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateEducation(name as string, value as string);
  };

  const handleAddForeignLanguage = () => {
    resumeStore.addForeignLanguage({ language: '', level: '' });
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
          <FormControl fullWidth error={fieldErrors.educationLevel}>
            <InputLabel id="educationLevelId">Уровень образования*</InputLabel>
            <Select
              labelId="educationLevelId"
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
          </FormControl>
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

        {resumeStore.foreignLanguages && (
          <>
            {resumeStore.foreignLanguages.map((_, index) => (
              <LanguageFields key={index} index={index} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddForeignLanguage}>
                Добавить язык
              </Button>
            </Grid>
          </>
        )}
        {/* {resumeStore.educations.map((edu, index) => (
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
        ))} */}
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
