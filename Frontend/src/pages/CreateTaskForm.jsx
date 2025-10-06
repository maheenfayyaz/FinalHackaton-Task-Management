import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyNavbar from '../Components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateTaskForm = () => {
  const userName = useSelector((state) => state.auth.userName);
  const userImage = useSelector((state) => state.auth.userImage);
  const userRole = useSelector((state) => state.auth.userRole); 
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const apiUrl = import.meta.env.REACT_APP_API_URL;

  useEffect(() => {
    if (location.state && location.state.task) {
      const task = location.state.task;
      setTitle(task.title || '');
      setDescription(task.description || '');
      setAssignedTo(task.assignedTo || '');
      setStatus(task.status || 'To Do');
      setIsEditMode(true);
      setTaskId(task._id);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      if (isEditMode) {
        const response = await axios.put(
          `${apiUrl}/updatetask/${taskId}`,
          { title, description, assignedTo, status },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setMessage('Task updated successfully!');
      } else {
        const response = await axios.post(
          `${apiUrl}/createtask`,
          { title, description, assignedTo, status },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setMessage('Task created successfully!');
      }
      navigate('/showalltask');
    } catch (error) {
      setLoading(false);
      setMessage(isEditMode ? 'Failed to update task. Please try again.' : 'Failed to create task. Please try again.');
      console.error(error);
    }
  };

  if (userRole !== 'admin') {
    return (
      <>
        <MyNavbar userName={userName} userImage={userImage} />
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '8px', color: 'red', textAlign: 'center' }}>
          <h3>Access Denied</h3>
          <p>You do not have permission to create tasks.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MyNavbar userName={userName} userImage={userImage} />

      <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', backgroundColor: '#e6f0ff', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="assignedTo" style={{ display: 'block', marginBottom: '5px' }}>Assigned To</label>
            <input
              id="assignedTo"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '5px' }}>Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Submitting...' : isEditMode ? 'Update' : 'Submit'}
          </button>
        </form>
        {message && <p style={{ marginTop: '15px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </>
  );
};

export default CreateTaskForm;
