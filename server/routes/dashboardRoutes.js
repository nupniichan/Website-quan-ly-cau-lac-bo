const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Club = require('../models/Club');
const Prize = require('../models/Prize');
const Member = require('../models/Member');

// Get dashboard data for student
router.get('/dashboard/student/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Get clubs managed by the student
        const managedClubs = await Club.find({ truongBanCLB: userId });
        
        // Get total members from all managed clubs
        const totalMembers = await Member.countDocuments({
            club: { $in: managedClubs.map(club => club._id) }
        });

        // Get recent members from managed clubs
        const recentMembers = await Member.find({
            club: { $in: managedClubs.map(club => club._id) }
        })
        .populate({
            path: 'club',
            select: 'ten'
        })
        .sort({ ngayThamGia: -1 })
        .limit(10);

        // Calculate total budget (you may need to adjust this based on your budget model)
        const budget = 0; // Replace with actual budget calculation

        // Get monthly event statistics
        const eventStats = new Array(12).fill(0);
        const events = await Event.find({
            club: { $in: managedClubs.map(club => club._id) },
            ngayToChuc: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        events.forEach(event => {
            const month = new Date(event.ngayToChuc).getMonth();
            eventStats[month]++;
        });

        // Get monthly award statistics
        const awardStats = new Array(12).fill(0);
        const awards = await Prize.find({
            club: { $in: managedClubs.map(club => club._id) },
            ngayDatGiai: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        awards.forEach(award => {
            const month = new Date(award.ngayDatGiai).getMonth();
            awardStats[month]++;
        });

        // Tính tổng số giải thưởng từ các CLB do học sinh quản lý
        const totalAwards = await Prize.countDocuments({
            club: { $in: managedClubs.map(club => club._id) }
        });

        res.json({
            managedClubs,
            totalMembers,
            budget,
            eventStats,
            awardStats,
            recentMembers,
            totalAwards
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get dashboard data for teacher
router.get('/dashboard/teacher', async (req, res) => {
    try {
        // Get total clubs
        const totalClubs = await Club.countDocuments();

        // Get total students
        const totalStudents = await Member.countDocuments();

        // Get total events in current year
        const totalEvents = await Event.countDocuments({
            ngayToChuc: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        // Get total awards in current year
        const totalAwards = await Prize.countDocuments({
            ngayDatGiai: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        // Get monthly school event statistics
        const schoolEventStats = new Array(12).fill(0);
        const events = await Event.find({
            ngayToChuc: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        events.forEach(event => {
            const month = new Date(event.ngayToChuc).getMonth();
            schoolEventStats[month]++;
        });

        // Get monthly awards statistics
        const schoolAwardsStats = new Array(12).fill(0);
        const awards = await Prize.find({
            ngayDatGiai: {
                $gte: new Date(new Date().getFullYear(), 0, 1),
                $lte: new Date(new Date().getFullYear(), 11, 31)
            }
        });

        awards.forEach(award => {
            const month = new Date(award.ngayDatGiai).getMonth();
            schoolAwardsStats[month]++;
        });

        res.json({
            totalClubs,
            totalStudents,
            totalEvents,
            totalAwards,
            schoolEventStats,
            schoolAwardsStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 