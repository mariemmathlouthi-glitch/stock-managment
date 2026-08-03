const User = require("../models/User");

const formatMonthLabels = (startMonth, count) => {
  const labels = [];
  const date = new Date(startMonth);

  for (let i = 0; i < count; i += 1) {
    labels.push(date.toLocaleString("default", { month: "short", year: "numeric" }));
    date.setMonth(date.getMonth() + 1);
  }

  return labels;
};

const getDashboardOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfToday } });

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    const weeklySignups = await User.countDocuments({ createdAt: { $gte: startOfWeek } });

    const last7Days = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });

    const dailyStats = await User.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyMap = dailyStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const dailyLabels = last7Days.map((date) =>
      date.toLocaleDateString("default", { month: "short", day: "numeric" })
    );
    const dailyData = last7Days.map((date) => {
      const key = date.toISOString().split("T")[0];
      return dailyMap[key] || 0;
    });

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 8, 1);

    const monthlyStats = await User.aggregate([
      { $match: { createdAt: { $gte: startMonth } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyMap = monthlyStats.reduce((acc, item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      acc[key] = item.count;
      return acc;
    }, {});

    const monthlyLabels = formatMonthLabels(startMonth, 9);
    const monthlyData = Array.from({ length: 9 }, (_, index) => {
      const date = new Date(startMonth);
      date.setMonth(startMonth.getMonth() + index);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return monthlyMap[key] || 0;
    });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select("prenom nom email role createdAt")
      .lean();

    res.json({
      summary: {
        totalUsers,
        totalAdmins,
        newUsersToday,
        weeklySignups,
      },
      charts: {
        monthlySignups: {
          labels: monthlyLabels,
          data: monthlyData,
        },
        dailySignups: {
          labels: dailyLabels,
          data: dailyData,
        },
        weeklySignups: {
          labels: dailyLabels,
          data: dailyData,
        },
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

module.exports = {
  getDashboardOverview,
};
