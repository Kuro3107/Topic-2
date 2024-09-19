import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Menu from './Menu';

function Home() {
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./src/HTML/Home.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        const bodyContent = html.match(/<body>([\s\S]*)<\/body>/i);
        if (bodyContent && bodyContent[1]) {
          setHtmlContent(bodyContent[1]);
        } else {
          throw new Error('Could not extract body content from HTML');
        }
      })
      .catch(e => {
        console.error('Error:', e);
        setError(e.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!htmlContent) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default Home;