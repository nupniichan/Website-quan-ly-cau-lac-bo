import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddClub = () => {
    const [formData, setFormData] = useState({
        ten: '',
        logo: '',
        linhVucHoatDong: '',
        ngayThanhLap: '',
        giaoVienPhuTrach: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log('Submitting form with data:', formData); // Debug log

        try {
            const response = await axios.post('http://localhost:5000/api/clubs', formData);
            console.log('Club created:', response.data);
            navigate('/club-management'); // Redirect to club management page after successful addition
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong!');
            console.error('Error creating club:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Add Club</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Tên câu lạc bộ:</label>
                    <input
                        type="text"
                        name="ten"
                        value={formData.ten}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">URL Logo:</label>
                    <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Lĩnh vực hoạt động:</label>
                    <input
                        type="text"
                        name="linhVucHoatDong"
                        value={formData.linhVucHoatDong}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Ngày thành lập:</label>
                    <input
                        type="date"
                        name="ngayThanhLap"
                        value={formData.ngayThanhLap}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Giáo viên phụ trách:</label>
                    <input
                        type="text"
                        name="giaoVienPhuTrach"
                        value={formData.giaoVienPhuTrach}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Create Club
                </button>
            </form>
        </div>
    );
};

export default AddClub;
