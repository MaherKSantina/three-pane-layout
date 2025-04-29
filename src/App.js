import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IconMenu from './components/IconMenu';
import ProcessFlow from './components/ProcessFlow';
import { UIEditorLayout } from './components/UIEditorLayout';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<UIEditorLayout></UIEditorLayout>} />
      <Route path="/iconMenu" element={<IconMenu></IconMenu>} />
      </Routes>
      
    </Router>
  );
}

export default App;
