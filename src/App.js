// Import necessary libraries and styles
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

// TodoApp component
function TodoApp() {
  // State variables
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [todos, setTodos] = useState([]);

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = () => {
    if (task.trim() === '') {
      alert('Task cannot be empty');
      return;
    }

    const newTodo = {
      id: Date.now(),
      task: task.trim(),
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setTask('');
    setDueDate(null);
  };

  // Function to edit an existing todo
  const editTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, task: task.trim(), dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null, editing: false }
        : todo
    );

    setTodos(updatedTodos);
    setTask('');
    setDueDate(null);
  };

  // Function to mark a todo as completed
  const completeTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: true, completionMessage: "Great job! Task completed!" } : todo
    );

    setTodos(updatedTodos);
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  // Function to start editing a todo
  const startEditing = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, editing: true } : { ...todo, editing: false }
    );

    setTodos(updatedTodos);
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setTask(todoToEdit.task);
      setDueDate(todoToEdit.dueDate ? new Date(todoToEdit.dueDate) : null);
    }
  };

  // Return JSX for rendering the TodoApp
  return (
    <div className="container mt-5 w-md-50">
      <h3 className="text-center">React_Task_Manager</h3>
      <div className="input-group">
        <input
          className="form-control col"
          onChange={(e) => setTask(e.target.value)}
          type="text"
          value={task}
        />
        <DatePicker
          className="form-control col"
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          isClearable
          placeholderText="Select Due Date"
        />
        <button
          onClick={todos.some((todo) => todo.editing) ? () => editTodo(todos.find((todo) => todo.editing).id) : addTodo}
          className="btn btn-primary col-md-auto"  
        >
          {todos.some((todo) => todo.editing) ? 'Save' : 'Add'}
        </button>
      </div>
      <ul className="mt-4 list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              todo.completed ? 'completed' : ''
            }`}
          >
            {todo.editing ? (
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <DatePicker
                  className="mt-2 form-control"
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  isClearable
                  placeholderText="Select Due Date"
                />
              </div>
            ) : (
              <div className="col">
                <p>{todo.task}</p>
                {todo.dueDate && <p>Due Date: {todo.dueDate}</p>}
                {todo.completed && <p className="text-success">{todo.completionMessage}</p>}
              </div>
            )}
            <div>
              {todo.completed ? (
                <p className="text-success">Task Completed</p>
              ) : (
                <>
                  {todo.editing ? (
                    <button onClick={() => editTodo(todo.id)} className="btn btn-success me-2 btn-sm">
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => completeTodo(todo.id)} className="btn btn-info me-2 btn-sm">
                        Complete
                      </button>
                      <button onClick={() => startEditing(todo.id)} className="btn btn-warning me-2 btn-sm">
                        Edit
                      </button>
                    </>
                  )}
                </>
              )}
              <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export the TodoApp component
export default TodoApp;