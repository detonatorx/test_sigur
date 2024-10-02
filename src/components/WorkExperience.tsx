import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControlLabel, Radio, RadioGroup, Box, Typography, IconButton } from '@mui/material';
import { resumeStore, IWorkExperience } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';

const WorkExperienceFields: React.FC<{ index: number }> = observer(({ index }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    resumeStore.updateWorkExperience(index, name as keyof IWorkExperience, value);
  };

  const handleDateChange = (date: Date | null, type: 'startDate' | 'endDate') => {
    if (date) {
      resumeStore.updateWorkExperience(index, type, date);
    }

    if (type === 'endDate') {
      resumeStore.updateWorkExperience(index, 'checked', false);

    }
  };

  const handleDelete = () => {
    resumeStore.removeWorkExperience(index);
  };

  const handleCurrentJobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    resumeStore.updateWorkExperience(index, 'endDate', checked ? null : new Date());
    resumeStore.updateWorkExperience(index, 'checked', checked);
  };

  console.log('resumeStore.workExperiences[index].startDate', typeof resumeStore.workExperiences[index].startDate)
  return (
    <>
      <Grid item xs={12} container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Опыт работы #{index + 1}</Typography>
        <IconButton onClick={handleDelete} color="error">
          {resumeStore.workExperiences.length > 1 && <DeleteIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label="Дата начала (MM/ГГГГ)"
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].startDate}
          onChange={(date) => handleDateChange(date, 'startDate')}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label='Дата окончания (MM/ГГГГ)'
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].endDate}
          onChange={(date) => handleDateChange(date, 'endDate')}
        // onChange={(date: Date | null) => handleDateChange(date, 'endDate')}

        />
        <FormControlLabel
          control={
            <Radio
              checked={resumeStore.workExperiences[index].checked === true}
              onChange={handleCurrentJobChange}
            />
          }
          label="По настоящее время"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Название компании"
          name="company"
          value={resumeStore.workExperiences[index].company}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Должность"
          name="position"
          value={resumeStore.workExperiences[index].position}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Обязанности"
          name="responsibilities"
          value={resumeStore.workExperiences[index].responsibilities}
          onChange={handleChange}
        />
      </Grid>
    </>
  );
});
const WorkExperience: React.FC = observer(() => {
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'hasWorkExperience') {
      resumeStore.setHasWorkExperience(value === 'true');
    }
  };

  const handleAddExperience = () => {
    resumeStore.addWorkExperience({
      startDate: null,
      endDate: null,
      company: '',
      position: '',
      responsibilities: '',
      checked: false
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // All work experiences are already saved in the store
    navigate('/education');
  };

  useEffect(() => {
    if (resumeStore.workExperiences.length === 0) {
      resumeStore.addWorkExperience({
        startDate: null,
        endDate: null,
        company: '',
        position: '',
        responsibilities: '',
        checked: false
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RadioGroup
            name="hasWorkExperience"
            value={resumeStore.hasWorkExperience.toString()}
            onChange={handleChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Есть опыт работы" />
            <FormControlLabel value="false" control={<Radio />} label="Нет опыта работы" />
          </RadioGroup>
        </Grid>

        {resumeStore.hasWorkExperience && (
          <>
            {resumeStore.workExperiences.map((_, index) => (
              <WorkExperienceFields key={index} index={index} />
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddExperience}>
                Добавить место работы
              </Button>
            </Grid>
          </>
        )}

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


export default WorkExperience;
