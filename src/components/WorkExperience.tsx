import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControlLabel, Radio, RadioGroup, Box, Typography } from '@mui/material';
import { resumeStore, IWorkExperience } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';

const WorkExperienceFields: React.FC<{ index: number }> = observer(({ index }) => {
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    resumeStore.updateWorkExperience(index, name as keyof IWorkExperience, value);
  };

  const handleDateChange = (date: Date | null, type: 'startDate' | 'endDate') => {
    if (date) {
      resumeStore.updateWorkExperience(index, type, date.toISOString());
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Опыт работы #{index + 1}</Typography>
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label="Дата начала (MM/YYYY)"
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].startDate ? new Date(resumeStore.workExperiences[index].startDate) : null}
          onChange={(date) => handleDateChange(date, 'startDate')}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label="Дата окончания (MM/YYYY)"
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].endDate ? new Date(resumeStore.workExperiences[index].endDate) : null}
          onChange={(date) => handleDateChange(date, 'endDate')}
        />
        <FormControlLabel
          control={
            <Radio
              checked={isCurrentJob}
              onChange={() => {
                setIsCurrentJob(!isCurrentJob);
                const newEndDate = isCurrentJob ? '' : 'По настоящее время';
                resumeStore.updateWorkExperience(index, 'endDate', newEndDate);
              }}
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

  useEffect(() => {
    if (resumeStore.workExperiences.length === 0) {
      resumeStore.addWorkExperience({
        startDate: '',
        endDate: '',
        company: '',
        position: '',
        responsibilities: ''
      });
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'hasWorkExperience') {
      resumeStore.setHasWorkExperience(value === 'true');
    }
  };

  const handleAddExperience = () => {
    resumeStore.addWorkExperience({
      startDate: '',
      endDate: '',
      company: '',
      position: '',
      responsibilities: ''
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // All work experiences are already saved in the store
    navigate('/education');
  };

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
