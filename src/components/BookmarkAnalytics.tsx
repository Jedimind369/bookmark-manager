import React, { useEffect, useState } from 'react';
import { Bookmark } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BookmarkAnalyticsProps {
  bookmarks: Bookmark[];
}

const BookmarkAnalytics: React.FC<BookmarkAnalyticsProps> = ({ bookmarks }) => {
  const [categoryData, setCategoryData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [tagData, setTagData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });

  useEffect(() => {
    const categoryCount: { [key: string]: number } = {};
    const tagCount: { [key: string]: number } = {};

    bookmarks.forEach((bookmark) => {
      bookmark.categories.forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      bookmark.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

    setCategoryData({
      labels: sortedCategories.map(([category]) => category),
      data: sortedCategories.map(([, count]) => count),
    });

    setTagData({
      labels: sortedTags.map(([tag]) => tag),
      data: sortedTags.map(([, count]) => count),
    });
  }, [bookmarks]);

  const categoryChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Bookmarks per Category',
        data: categoryData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const tagChartData = {
    labels: tagData.labels,
    datasets: [
      {
        label: 'Bookmarks per Tag',
        data: tagData.data,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bookmark Analytics',
      },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Bookmark Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Top Categories</h3>
          <Bar data={categoryChartData} options={options} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Top Tags</h3>
          <Bar data={tagChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BookmarkAnalytics;