
import React from 'react';

interface WelcomeProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeProps) => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  // Determine greeting based on time of day
  const hour = currentDate.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  if (hour >= 18) greeting = 'Good evening';

  return (
    <div className="mb-8 animate-fade-in">
      <p className="text-gray-600 text-sm md:text-base">{formattedDate}</p>
      <h1 className="text-3xl md:text-4xl font-bold text-taskloop-darkblue mt-1">
        {greeting}, {userName}
      </h1>
    </div>
  );
};

export default WelcomeSection;
