import React from 'react';
import { RegionalCareerMap } from './RegionalCareerMap';
import { JobOpportunity, UserProfile } from '../types/career';

interface GambiaCareerMapProps {
  userProfile?: UserProfile | null;
  countryCode?: string;
  onApplyForJob?: (job: JobOpportunity) => void;
  onGenerateCVForJob?: (jobTitle: string, company: string) => void;
}

export const GambiaCareerMap: React.FC<GambiaCareerMapProps> = (props) => {
  return <RegionalCareerMap {...props} />;
};

export default GambiaCareerMap;
