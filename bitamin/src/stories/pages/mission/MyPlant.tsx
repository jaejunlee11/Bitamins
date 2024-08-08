import React, { useEffect, useState } from 'react';
import { getExperience } from '@/api/missionAPI';

const MyPlant: React.FC = () => {
  const [experience, setExperience] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperience();
        const experienceValue = data.experience;
        setExperience(experienceValue);
        setLevel(calculateLevel(experienceValue));
      } catch (err) {
        setError('경험치 못 가져옴.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const calculateLevel = (experience: number): number => {
    return Math.min(Math.floor(experience / 10) + 1, 50);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Experience</h1>
      <p>Experience: {experience}</p>
      <p>Level: {level}</p>
    </div>
  );
};

export default MyPlant;
