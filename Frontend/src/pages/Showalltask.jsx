import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import MyNavbar from '../Components/Navbar'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import '../assets/css/style.css'

const Showalltask = () => {
  const userName = useSelector((state) => state.auth.userName)
  const userImage = useSelector((state) => state.auth.userImage)
  const userRole = useSelector((state) => state.auth.userRole)
  const token = useSelector((state) => state.auth.token)
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.REACT_APP_API_URL}/getalltasks`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.status === 200) {
          setTasks(response.data.tasks)
        } else {
          console.error('Failed to fetch tasks')
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    if (token) {
      fetchTasks()
    }
  }, [token])

  const statuses = ['To Do', 'In Progress', 'Completed']

  const tasksByStatus = {
    'To Do': tasks ? tasks.filter((task) => task.status === 'To Do') : [],
    'In Progress': tasks ? tasks.filter((task) => task.status === 'In Progress') : [],
    Completed: tasks ? tasks.filter((task) => task.status === 'Completed') : [],
  }

const handleDelete = async (taskId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${import.meta.env.REACT_APP_API_URL}/deletetask/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
        Swal.fire('Deleted!', 'Task deleted successfully.', 'success')
      } else {
        Swal.fire('Error!', 'Failed to delete task.', 'error')
      }
    } catch (error) {
      Swal.fire('Error!', 'Error deleting task.', 'error')
    }
  }
}

const handleEdit = (task) => {
  navigate('/createtaskform', { state: { task } })
}

const onDragEnd = async (result) => {
  const { source, destination, draggableId } = result

  if (!destination) return

  if (source.droppableId === destination.droppableId && source.index === destination.index) return

  const sourceStatus = source.droppableId
  const destStatus = destination.droppableId

  const draggedTask = tasks.find((task) => task._id === draggableId)
  if (!draggedTask) return

  if (userRole !== 'admin' && draggedTask.assignedTo !== userName) {
    setTasks(tasks)
    return
  }

  const updatedTask = { ...draggedTask, status: destStatus }
  const newTasks = tasks.map((task) => (task._id === draggableId ? updatedTask : task))
  setTasks(newTasks)

  try {
    let payload;
    if (userRole === 'admin') {
      const { _id, created_at, updated_at, __v, ...allowedFields } = updatedTask;
      payload = allowedFields;
    } else {
      payload = { status: destStatus };
    }
    const response = await axios.put(`${import.meta.env.REACT_APP_API_URL}/updatetask/${draggableId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      console.error('Failed to update task status in backend');

    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

const renderTaskCard = (task, index) => {
  const bgColor = '#fff'
  const isDragDisabled = userRole !== 'admin' && task.assignedTo !== userName;
  return (
    <Draggable key={task._id} draggableId={task._id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: 15,
            margin: '0 0 8px 0',
            minWidth: 340,
            backgroundColor: snapshot.isDragging ? '#e0e0e0' : bgColor,
            border: '1px solid #ddd',
            borderRadius: 8,
            outline: snapshot.isDragging ? 'none' : undefined,
            boxShadow: snapshot.isDragging ? 'none' : undefined,
            ...provided.draggableProps.style,
          }}
          className="task-card"
        >
          <strong style={{ fontSize: '18px' }}>{task.title}</strong>
          <p style={{ margin: '8px 0px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{task.description}</p>
          <p style={{ margin: '8px 0', fontWeight: 'bold' }}>Assigned To: {task.assignedTo}</p>
          <div className="task-card-buttons">
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => handleEdit(task)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

return (
  <div>
    <MyNavbar userName={userName} userImage={userImage} />
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board-container">
        {statuses.map((status) => (
          <div key={status} className="status-column">
            <div className={`status-header ${status === 'In Progress' ? 'in-progress' : ''} ${status === 'Completed' ? 'completed' : ''}`}>
              <h3>{status}</h3>
              <p>{tasksByStatus[status].length}</p>
            </div>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="droppable-area"
                >
                  {tasksByStatus[status].map((task, index) => renderTaskCard(task, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  </div>
)
}

export default Showalltask;
