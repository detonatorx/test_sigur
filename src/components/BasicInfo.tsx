import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, SelectChangeEvent, FormHelperText, Typography, Box } from '@mui/material';
import { resumeStore } from '../stores/resumeStore';
import { DatePicker } from '@mui/x-date-pickers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BasicInfo: React.FC = observer(() => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    resumeStore.updateBasicInfo(name, value);
    if (value) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    resumeStore.updateBasicInfo(name as string, value);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      resumeStore.updateBasicInfo('birthDate', date);
      setFieldErrors(prev => ({ ...prev, birthDate: false }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: Record<string, boolean> = {};
    const requiredFields = ['lastName', 'firstName', 'city', 'birthDate', 'gender', 'citizenship', 'desiredPosition', 'salary', 'currency', 'photo'];

    requiredFields.forEach(field => {
      if (!resumeStore[field as keyof typeof resumeStore]) {
        errors[field] = true;
      }
    });

    if (!selectedFile) {
      errors.photo = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
      navigate('/work-experience');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Загрузить фото
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
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
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                {selectedFile.name}
              </Typography>
            )}
            {fieldErrors.photo && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                "Фотография обязательна"
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Фамилия*"
            name="lastName"
            value={resumeStore.lastName}
            onChange={handleChange}
            error={fieldErrors.lastName}
            helperText={fieldErrors.lastName ? "Это поле обязательно" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Имя*"
            name="firstName"
            value={resumeStore.firstName}
            onChange={handleChange}
            error={fieldErrors.firstName}
            helperText={fieldErrors.firstName ? "Это поле обязательно" : ""}
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
            label="Город проживания*"
            name="city"
            value={resumeStore.city}
            onChange={handleChange}
            error={fieldErrors.city}
            helperText={fieldErrors.city ? "Это поле обязательно" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <DatePicker
            label="Дата рождения*"
            value={resumeStore.birthDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                error: fieldErrors.birthDate,
                helperText: fieldErrors.birthDate ? "Это поле обязательно" : "",
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" error={fieldErrors.gender}>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={resumeStore.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Мужской" />
              <FormControlLabel value="female" control={<Radio />} label="Женский" />
            </RadioGroup>
            {fieldErrors.gender && <FormHelperText>Это поле обязательно</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Гражданство*"
            name="citizenship"
            value={resumeStore.citizenship}
            onChange={handleChange}
            error={fieldErrors.citizenship}
            helperText={fieldErrors.citizenship ? "Это поле обязательно" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Желаемая должность*"
            name="desiredPosition"
            value={resumeStore.desiredPosition}
            onChange={handleChange}
            error={fieldErrors.desiredPosition}
            helperText={fieldErrors.desiredPosition ? "Это поле обязательно" : ""}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Зарплата*"
            name="salary"
            type="number"
            value={resumeStore.salary}
            onChange={handleChange}
            error={fieldErrors.salary}
            helperText={fieldErrors.salary ? "Это поле обязательно" : ""}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth error={fieldErrors.currency}>
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
            {fieldErrors.currency && <FormHelperText>Это поле обязательно</FormHelperText>}
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
