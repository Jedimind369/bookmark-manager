import React from 'react';
import { PersonalGrowthInputProps } from '../types';
import TextArea from './TextArea';

const PersonalGrowthInput: React.FC<PersonalGrowthInputProps> = ({ notes, onNotesChange }) => {
  return (
    <TextArea
      placeholder="How does this bookmark contribute to your personal growth or ikigai?"
      value={notes}
      onChange={(e) => onNotesChange(e.target.value)}
      className="h-24"
    />
  );
};

export default PersonalGrowthInput;