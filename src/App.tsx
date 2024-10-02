import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BasicInfo from './components/BasicInfo';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Review from './components/Review';
import Layout from './components/Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ru } from 'date-fns/locale';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Routes>
              <Route path="/" element={<BasicInfo />} />
              <Route path="/work-experience" element={<WorkExperience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/review" element={<Review />} />
            </Routes>
          </LocalizationProvider>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
