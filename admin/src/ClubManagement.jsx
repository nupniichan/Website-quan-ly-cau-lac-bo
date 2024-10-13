import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  // Fetch clubs from the API
  const fetchClubs = async () => {
    try {
      console.log('Fetching clubs...'); // Debug log
      const response = await axios.get('http://localhost:5000/api/clubs');
      console.log('Fetched clubs:', response.data); // Log the response
      setClubs(response.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  // Delete a club
  const handleDelete = async (id) => {
    console.log(`Attempting to delete club with ID: ${id}`); // Debug log
    try {
      await axios.delete(`/api/clubs/${id}`);
      console.log(`Club with ID: ${id} deleted successfully.`); // Debug log
      fetchClubs(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  // Navigate to add club page
  const handleAddClub = () => {
    console.log('Navigating to add club page'); // Debug log
    navigate('/add-club');
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Club Management</h1>
      <button
        onClick={handleAddClub}
        className="bg-blue-500 text-white rounded p-2 mb-4 hover:bg-blue-600 transition"
      >
        Add Club
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Activity Area</th>
              <th className="border border-gray-300 p-2">Date Founded</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(clubs) && clubs.length > 0 ? (
              clubs.map((club) => (
                <tr key={club._id} className="hover:bg-gray-100 transition">
                  <td className="border border-gray-300 p-2">{club.ten}</td>
                  <td className="border border-gray-300 p-2">{club.linhVucHoatDong}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(club.ngayThanhLap).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => navigate(`/clubs/${club._id}`)}
                      className="bg-green-500 text-white rounded p-1 mr-2 hover:bg-green-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(club._id)}
                      className="bg-red-500 text-white rounded p-1 hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No clubs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubManagement;
