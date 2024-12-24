
import React from 'react';
import { BookmarkList } from './organisms/BookmarkList';
import { BookmarkForm } from './molecules/BookmarkForm';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        <BookmarkForm />
        <BookmarkList />
      </div>
    </div>
  );
};

export default Dashboard;
