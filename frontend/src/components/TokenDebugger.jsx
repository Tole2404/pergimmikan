import { useState, useEffect } from 'react';
import { Button, Modal, Card } from 'react-bootstrap';

const TokenDebugger = () => {
  const [showModal, setShowModal] = useState(false);
  const [tokenData, setTokenData] = useState({
    adminToken: '',
    decodedToken: null,
    adminData: null
  });

  const decodeToken = (token) => {
    try {
      // JWT token terdiri dari 3 bagian: header.payload.signature
      // Kita hanya ingin payload yang berisi data
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return { error: 'Invalid token format' };
    }
  };

  const analyzeToken = () => {
    const adminToken = localStorage.getItem('adminToken') || '';
    const adminDataStr = localStorage.getItem('adminData') || '{}';
    
    let adminData;
    try {
      adminData = JSON.parse(adminDataStr);
    } catch (e) {
      adminData = { error: 'Invalid JSON format' };
    }

    let decodedToken = null;
    if (adminToken) {
      decodedToken = decodeToken(adminToken);
    }

    setTokenData({
      adminToken,
      decodedToken,
      adminData
    });

    setShowModal(true);
  };

  useEffect(() => {
    // Automatically trigger the analysis when component mounts
    analyzeToken();
  }, []);

  return (
    <div className="fixed-bottom mb-3 ml-3" style={{ zIndex: 1050 }}>
      <Button 
        variant="warning" 
        size="sm" 
        onClick={analyzeToken}
        className="shadow-sm"
      >
        Debug Token
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Admin Token Debugger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="mb-3">
            <Card.Header className="bg-info text-white">Admin Token</Card.Header>
            <Card.Body>
              <small className="text-muted d-block">First 50 chars:</small>
              <pre className="border p-2 bg-light">
                {tokenData.adminToken ? tokenData.adminToken.substring(0, 50) + '...' : 'No token found'}
              </pre>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header className="bg-success text-white">Decoded Token Payload</Card.Header>
            <Card.Body>
              <pre className="border p-2 bg-light">
                {JSON.stringify(tokenData.decodedToken, null, 2) || 'No decoded data'}
              </pre>
              
              {tokenData.decodedToken && !tokenData.decodedToken.role && (
                <div className="alert alert-danger mt-2">
                  <strong>Warning!</strong> The token does not contain a 'role' property which is 
                  required for admin authentication.
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="bg-primary text-white">Admin Data in LocalStorage</Card.Header>
            <Card.Body>
              <pre className="border p-2 bg-light">
                {JSON.stringify(tokenData.adminData, null, 2) || 'No admin data found'}
              </pre>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TokenDebugger;
