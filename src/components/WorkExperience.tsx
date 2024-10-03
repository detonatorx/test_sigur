import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControlLabel, Radio, RadioGroup, Box, Typography, IconButton } from '@mui/material';
import { resumeStore, IWorkExperience } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';

interface IWorkExperienceFieldsProps {
  index: number;
  fieldErrors: Record<string, boolean>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const WorkExperienceFields: React.FC<IWorkExperienceFieldsProps> = observer(({ index, fieldErrors, setFieldErrors }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    resumeStore.updateWorkExperience(index, name as keyof IWorkExperience, value);

    if (value) {
      setFieldErrors(prev => ({ ...prev, [`${name}-${index}`]: false }));
    }
  };


  const handleDateChange = (date: Date | null, type: 'startDate' | 'endDate') => {
    if (date) {
      resumeStore.updateWorkExperience(index, type, date);
      setFieldErrors(prev => ({ ...prev, [`${type}-${index}`]: false }));
    }

    if (type === 'endDate') {
      resumeStore.updateWorkExperience(index, 'checked', false);

      const currentExperience = resumeStore.workExperiences[index];

      if (currentExperience && currentExperience.startDate && currentExperience.endDate &&
        currentExperience.startDate >= currentExperience.endDate && !currentExperience.checked) {
        const errors: Record<string, boolean> = {
          [`dateOrder-${index}`]: true
        };

        setFieldErrors(prev => ({ ...prev, ...errors }));
      } else {
        setFieldErrors(prev => ({ ...prev, [`dateOrder-${index}`]: false }));
      }
    }
  };

  const handleDelete = () => {
    resumeStore.removeWorkExperience(index);
  };

  const handleCurrentJobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    resumeStore.updateWorkExperience(index, 'endDate', checked && null);
    resumeStore.updateWorkExperience(index, 'checked', checked);

    if (checked) {
      setFieldErrors(prev => ({ ...prev, [`dateOrder-${index}`]: false }));
    }
  };

  return (
    <>
      <Grid item xs={12} container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Опыт работы #{index + 1}</Typography>
        <IconButton onClick={handleDelete} color="error">
          {resumeStore.workExperiences.length > 1 && <DeleteIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        {fieldErrors[`dateOrder-${index}`] && (
          <Typography color="error">
            Дата начала должна быть раньше даты окончания
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label="Дата начала"
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].startDate}
          onChange={(date) => handleDateChange(date, 'startDate')}
          slotProps={{
            textField: {
              error: fieldErrors[`startDate-${index}`],
              helperText: fieldErrors[`startDate-${index}`] ? "Это поле обязательно" : "",
            },
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <DatePicker
          label='Дата окончания'
          views={['year', 'month']}
          value={resumeStore.workExperiences[index].endDate}
          onChange={(date) => handleDateChange(date, 'endDate')}
          slotProps={{
            textField: {
              error: fieldErrors[`endDate-${index}`],
              helperText: fieldErrors[`endDate-${index}`] ? "Это поле обязательно" : "",
            },
          }}
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
          label="Название компании*"
          name="company"
          value={resumeStore.workExperiences[index].company}
          onChange={handleChange}
          error={fieldErrors[`company-${index}`]}
          helperText={fieldErrors[`company-${index}`] ? "Это поле обязательно" : ""}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Должность*"
          name="position"
          value={resumeStore.workExperiences[index].position}
          onChange={handleChange}
          error={fieldErrors[`position-${index}`]}
          helperText={fieldErrors[`position-${index}`] ? "Это поле обязательно" : ""}
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'hasWorkExperience') {
      resumeStore.setHasWorkExperience(value === 'true');
    }

    if (value === 'false') {
      setFieldErrors({});
    }
  };

  console.log('fieldErrors', fieldErrors);

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
    const errors: Record<string, boolean> = {};

    if (resumeStore.hasWorkExperience) {
      resumeStore.workExperiences.forEach((experience, index) => {
        ['startDate', 'company', 'position'].forEach(field => {
          if (!experience[field as keyof IWorkExperience]) {
            errors[`${field}-${index}`] = true;
          }
        });
        ['endDate'].forEach(field => {
          if (!experience[field as keyof IWorkExperience] && experience.checked === false) {
            errors[`${field}-${index}`] = true;
          }
        });
      });

      if (Object.keys(errors).length > 0) {
        setFieldErrors(prev => ({ ...prev, ...errors }));
      }

      setFieldErrors(prev => ({ ...prev, ...errors }));

      const check = Object.keys(fieldErrors).filter(key => {
        console.log("key.split('-')[1]}", key.split('-')[1]);

        return (fieldErrors[`dateOrder-${key.split('-')[1]}`] === true)
      });

      if (check.length) {
        return;
      }
    }

    setFieldErrors({});
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
            value={resumeStore.hasWorkExperience}
            onChange={handleChange}
          >
            <FormControlLabel value="true" control={<Radio />} label="Есть опыт работы" />
            <FormControlLabel value="false" control={<Radio />} label="Нет опыта работы" />
          </RadioGroup>
        </Grid>

        {resumeStore.hasWorkExperience && (
          <>
            {resumeStore.workExperiences.map((_, index) => (
              <WorkExperienceFields key={index} index={index} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} />
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
