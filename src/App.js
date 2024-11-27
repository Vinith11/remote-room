import './App.css';
import { ApolloProvider } from '@apollo/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import client from './apollo/client';
import RoomsPage from './pages/RoomPage';
import DevicesPage from './pages/DevicesPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/devices/:roomId" element={<DevicesPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
