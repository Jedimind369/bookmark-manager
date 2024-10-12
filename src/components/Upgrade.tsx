import React, { useState } from 'react';
import { upgradeToPremiun } from '../utils/api';
import Button from './Button';

interface UpgradeProps {
  onUpgradeComplete: () => void;
}

const Upgrade: React.FC<UpgradeProps> = ({ onUpgradeComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await upgradeToPremiun();
      onUpgradeComplete();
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
      <p className="mb-4">Unlock advanced AI-powered features and unlimited storage!</p>
      <Button onClick={handleUpgrade} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Upgrade Now'}
      </Button>
    </div>
  );
};

export default Upgrade;