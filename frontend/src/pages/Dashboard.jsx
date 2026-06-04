import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // --- NEW STATE FOR MODAL & SEARCH ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get('import.meta.env.VITE_API_URL/teams', { withCredentials: true });
      setTeams(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('import.meta.env.VITE_API_URL/teams', { name: newTeamName, description: 'New Team' }, { withCredentials: true });
      setNewTeamName('');
      fetchTeams();
    } catch (err) {
      alert('Failed to create team');
    }
  };

  const handleSelectTeam = async (team) => {
    setSelectedTeam(team);
    try {
      const res = await axios.get(`import.meta.env.VITE_API_URL/tasks/team/${team.id}`, { withCredentials: true });
      setTasks(res.data);
    } catch (err) {
      alert('Failed to fetch tasks');
    }
  };

  // --- NEW: Handle Task Creation ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('import.meta.env.VITE_API_URL/tasks', {
        ...taskForm,
        team_id: selectedTeam.id
      }, { withCredentials: true });

      setIsModalOpen(false); // Close Modal
      setTaskForm({ title: '', description: '', due_date: '' }); // Reset Form
      handleSelectTeam(selectedTeam); // Refresh the task list
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('import.meta.env.VITE_API_URL/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW: Filter tasks based on search bar ---
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Team Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN: TEAMS */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">My Teams</h2>
            <form onSubmit={handleCreateTeam} className="mb-4 flex">
              <input
                type="text" placeholder="New Team Name..." required value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 p-2 border rounded-l bg-white text-gray-900"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">+</button>
            </form>
            <ul>
              {teams.length === 0 ? <p className="text-gray-500 text-sm">No teams yet.</p> : null}
              {teams.map(team => (
                <li
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedTeam?.id === team.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  {team.name}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN: TASKS */}
          <div className="md:col-span-2 bg-white p-6 rounded shadow-md relative">
            {!selectedTeam ? (
              <p className="text-gray-500 text-center mt-10">Select a team on the left to view its tasks.</p>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedTeam.name} - Tasks</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    + Add Task
                  </button>
                </div>

                {/* SEARCH BAR */}
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mb-4 p-2 border rounded bg-white text-gray-900"
                />

                {filteredTasks.length === 0 ? <p className="text-gray-500">No tasks found.</p> : null}
                <div className="space-y-3">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="p-4 border rounded shadow-sm flex justify-between items-center bg-gray-50">
                      <div>
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        {task.due_date && <p className="text-xs text-red-500 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${task.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- TASK CREATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-gray-900">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <input
                type="text" placeholder="Task Title" required
                value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                className="w-full mb-3 p-2 border rounded bg-white"
              />
              <textarea
                placeholder="Description"
                value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="w-full mb-3 p-2 border rounded bg-white"
              />
              <input
                type="date"
                value={taskForm.due_date} onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                className="w-full mb-4 p-2 border rounded bg-white"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;