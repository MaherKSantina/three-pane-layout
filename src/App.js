import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import IconMenu from './components/IconMenu';
import ProcessFlow from './components/ProcessFlow';
import { UIEditor } from './components/UIEditor';
import Calendar from './components/Calendar';
import MatrixListWithDetails from './components/MatrixListWithDetails';
import MatricsCRUDDataTable from './components/MatricsCRUDDataTable';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Calendar itemID={11} slotDuration={"00:10:00"}></Calendar>} />
      <Route path="/matricesDetails" element={<MatrixListWithDetails></MatrixListWithDetails>} />
      <Route path="/matrices" element={<MatricsCRUDDataTable></MatricsCRUDDataTable>} />
      </Routes>
      
    </Router>
  );
}

export default App;
