import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Select, MenuItem, IconButton, Box, SelectChangeEvent, Typography, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IEducation, IForeignLanguage, resumeStore } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';

interface ILanguageProps {
  index: number;
  fieldErrors: Record<string, boolean>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const LanguageFields: React.FC<ILanguageProps> = observer(({ index, fieldErrors, setFieldErrors }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateForeignLanguage(index, name as keyof IForeignLanguage, value);

    if (value) {
      setFieldErrors(prev => ({ ...prev, [`${name}-${index}`]: false }));
    }
  }

  const handleDelete = () => {
    resumeStore.removeForeignLanguage(index);
  };

  return (
    <>
      <Grid item xs={6}>
        <TextField
          fullWidth
          name="language"
          label="Иностранный язык"
          value={resumeStore.foreignLanguages[index].language}
          onChange={handleChange}
          error={fieldErrors[`language-${index}`]}
        />
      </Grid>
      <Grid item xs={5.5}>
        <Select
          labelId="currency-label"
          name="level"
          value={resumeStore.foreignLanguages[index].level}
          onChange={handleChange}
          fullWidth
          error={fieldErrors[`level-${index}`]}
        >
          <MenuItem value="Начальный">Начальный</MenuItem>
          <MenuItem value="Средний">Средний</MenuItem>
          <MenuItem value="Высокий">Высокий</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={0.5} justifyContent={'flex-end'}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Grid>
    </>
  );
});

interface IEducationProps {
  index: number;
  fieldErrors: Record<string, boolean>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const EducationFields: React.FC<IEducationProps> = observer(({ index, fieldErrors, setFieldErrors }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    resumeStore.updateEducationPlace(index, name as keyof IEducation, value);

    if (value) {
      setFieldErrors(prev => ({ ...prev, [`${name}-${index}`]: false }));
    }
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      resumeStore.updateEducationPlace(index, 'graduationYear', date);
      setFieldErrors(prev => ({ ...prev, [`graduationYear-${index}`]: false }));
    }
  };

  const handleDelete = () => {
    resumeStore.removeEducation(index);
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12} container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">Место обучения #{index + 1}</Typography>
          <IconButton onClick={handleDelete} color="error">
            {resumeStore.educations.length > 1 && <DeleteIcon />}
          </IconButton>
        </Grid>

        <TextField
          fullWidth
          name="institution"
          label="Название учебного заведения*"
          value={resumeStore.educations[index].institution}
          onChange={handleChange}
          error={fieldErrors[`institution-${index}`]}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="faculty"
          label="Факультет*"
          value={resumeStore.educations[index].faculty}
          onChange={handleChange}
          error={fieldErrors[`faculty-${index}`]}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="specialization"
          label="Специализация*"
          value={resumeStore.educations[index].specialization}
          onChange={handleChange}
          error={fieldErrors[`specialization-${index}`]}
        />
      </Grid>
      <Grid item xs={12}>
        <DatePicker
          label='Год окончания*'
          views={['year']}
          value={resumeStore.educations[index].graduationYear}
          onChange={(date) => handleDateChange(date)}
          slotProps={{
            textField: {
              error: fieldErrors[`graduationYear-${index}`],
              helperText: fieldErrors[`graduationYear-${index}`] ? "Это поле обязательно" : "",
            },
          }}
        />
      </Grid>
    </>
  );
});

const Education: React.FC = observer(() => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateEducation(name as string, value as string);
  
    if (value) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
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
      graduationYear: null,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, boolean> = {};
  
    if (!resumeStore.educationLevel) {
      errors['educationLevel'] = true;
    }
  
    if (!resumeStore.nativeLanguage) {
      errors['nativeLanguage'] = true;
    }
  
    if (resumeStore.foreignLanguages.length) {
      resumeStore.foreignLanguages.forEach((language, index) => {
        ['language', 'level'].forEach(field => {
          if (!language[field as keyof IForeignLanguage]) {
            errors[`${field}-${index}`] = true;
          }
        });
      });
    }

    resumeStore.educations.forEach((education, index) => {
      ['institution', 'faculty', 'specialization', 'graduationYear'].forEach(field => {
        if (!education[field as keyof IEducation]) {
          errors[`${field}-${index}`] = true;
        }
      });
    });
  
    const check = Object.keys(fieldErrors).filter(key => {
      return (fieldErrors[`nativeLanguage-${key.split('-')[1]}`] === true)
    });

    if (check.length) {
      return;
    }

    if (Object.keys(errors).length) {
      setFieldErrors(prev => ({ ...prev, ...errors }));
      return;
    }
  
    setFieldErrors({});
    navigate('/review');
  };  

  useEffect(() => {
    if (resumeStore.educations.length === 0) {
      handleAddEducation();
    }
  }, []);
  
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
            >
              <MenuItem value="Среднее">Среднее</MenuItem>
              <MenuItem value="Среднее специальное">Среднее специальное</MenuItem>
              <MenuItem value="Высшее">Высшее</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="nativeLanguage"
            label="Родной язык*"
            value={resumeStore.nativeLanguage}
            onChange={handleChange}
            error={fieldErrors.nativeLanguage}
          />
        </Grid>

        {resumeStore.foreignLanguages.map((_, index) => (
          <LanguageFields key={index} index={index} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
        ))}
        <Grid item xs={12}>
          <Button onClick={handleAddForeignLanguage} startIcon={<AddIcon />}>
            Добавить язык
          </Button>
        </Grid>

        {resumeStore.educations.map((_, index) => (
          <EducationFields
            key={index}
            index={index}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
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
