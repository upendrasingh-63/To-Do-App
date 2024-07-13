// script.js

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to add a new task
const addTask = async (taskDescription) => {
  try {
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: taskDescription }),
    });
    const data = await response.json();
    console.log('Task added:', data);
    return data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Function to fetch all tasks
const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:5000/tasks');
    const tasks = await response.json();
    console.log('Tasks:', tasks);
    displayTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Function to update a task
const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: updatedTask }),
    });
    const data = await response.json();
    console.log('Task updated:', data);
    await fetchTasks(); // Refresh tasks after update
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Function to delete a task
const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log('Task deleted:', data);
    await fetchTasks(); // Refresh tasks after delete
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Function to display tasks in the UI
const displayTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      
      // Display task text
      const taskText = document.createElement('span');
      taskText.textContent = task.task;
      taskText.style.display = 'inline-block';
      
      // Input field for editing task (initially hidden)
      const input = document.createElement('input');
      input.classList.add('testInput');
      input.type = 'text';
      input.value = task.task;
      input.style.display = 'none';
      
      // Update button
      const updateButton = document.createElement('button');
      updateButton.classList.add('updateButton');
      updateButton.textContent = 'Update';
      updateButton.addEventListener('click', () => {
        taskText.style.display = 'none';
        input.style.display = 'inline-block';
        updateButton.style.display = 'none'; // Hide Update button
        saveButton.style.display = 'inline-block'; // Show Save button
        input.focus(); // Focus on input field for editing
      });
      
      // Save button for updating task
      const saveButton = document.createElement('button');
      saveButton.classList.add('saveButton');
      saveButton.textContent = 'Save';
      saveButton.style.display = 'none'; // Initially hidden
      saveButton.addEventListener('click', async () => {
        const updatedTask = input.value.trim();
        if (updatedTask) {
          await updateTask(task.id, updatedTask);
        }
        // Toggle visibility of elements after saving
        taskText.textContent = updatedTask;
        taskText.style.display = 'inline-block';
        input.style.display = 'none';
        saveButton.style.display = 'none';
        updateButton.style.display = 'inline-block'; // Show Update button again
      });
      
      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('deleteButton');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteTask(task.id);
      });
      
      // Append elements to list item
      li.appendChild(taskText);
      li.appendChild(input);
      li.appendChild(updateButton);
      li.appendChild(saveButton);
      li.appendChild(deleteButton);
      
      taskList.appendChild(li);
    });
  };

// Event listener for form submission (adding a new task)
taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const taskDescription = taskInput.value.trim();
  if (taskDescription) {
    try {
      await addTask(taskDescription);
      await fetchTasks(); // Refresh tasks after adding
      taskInput.value = ''; // Clear input field after adding task
    } catch (error) {
      console.error('Failed to add task:', error);
      // Handle errors (e.g., display error message)
    }
  }
});

// Fetch tasks when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchTasks();
  } catch (error) {
    console.error('Failed to load tasks:', error);
    // Handle errors (e.g., display error message)
  }
});
