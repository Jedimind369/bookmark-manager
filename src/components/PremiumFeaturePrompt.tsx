import React from 'react';
import Button from './Button';

interface PremiumFeaturePromptProps {
  onUpgrade: () => void;
}

const PremiumFeaturePrompt: React.FC<PremiumFeaturePromptProps> = ({ onUpgrade }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-bold">Premium Feature</p>
      <p>This feature is only available to premium users. Upgrade now to access advanced AI-powered insights and analytics!</p>
      <Button onClick={onUpgrade} className="mt-2">Upgrade to Premium</Button>
    </div>
  );
};

export default PremiumFeaturePrompt;