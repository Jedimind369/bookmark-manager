import React from 'react';
import { Bookmark } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BookmarkAnalyticsProps {
  bookmarks: Bookmark[];
}

export const BookmarkAnalytics: React.FC<BookmarkAnalyticsProps> = ({ bookmarks }) => {
  const categoryData = bookmarks.reduce((acc, bookmark) => {
    if (bookmark.categories) {
      bookmark.categories.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Bookmark Analytics</h2>
      <div className="h-64">
        <Pie data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};