import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, SelectChangeEvent } from '@mui/material';
import { resumeStore } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';

const BasicInfo: React.FC = observer(() => {
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    resumeStore.updateBasicInfo(name, value);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateBasicInfo(name as string, value);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      resumeStore.updateBasicInfo('birthDate', date.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/work-experience');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <input
            type="file"
            accept="image/"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target && typeof event.target.result === 'string') {
                    resumeStore.updateBasicInfo('photo', event.target.result);
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Фамилия"
            name="lastName"
            value={resumeStore.lastName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Имя"
            name="firstName"
            value={resumeStore.firstName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Отчество"
            name="middleName"
            value={resumeStore.middleName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Город проживания"
            name="city"
            value={resumeStore.city}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            label="Дата рождения*"
            value={resumeStore.birthDate ? new Date(resumeStore.birthDate) : null}
            onChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" required>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={resumeStore.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Мужской" />
              <FormControlLabel value="female" control={<Radio />} label="Женский" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Гражданство"
            name="citizenship"
            value={resumeStore.citizenship}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Желаемая должность"
            name="desiredPosition"
            value={resumeStore.desiredPosition}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Зарплата"
            name="salary"
            type="number"
            value={resumeStore.salary}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <InputLabel id="currency-label">Валюта*</InputLabel>
            <Select
              labelId="currency-label"
              name="currency"
              value={resumeStore.currency}
              onChange={handleSelectChange}
            >
              <MenuItem value="RUB">RUB</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="О себе"
            name="aboutMe"
            multiline
            rows={4}
            value={resumeStore.aboutMe}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Далее
          </Button>
        </Grid>
      </Grid>
    </form>
  );
});
export default BasicInfo;
