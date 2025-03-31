
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  jobTitle: string;
  time: string;
  address: string;
}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
}

const AppointmentList = ({ title, appointments }: AppointmentListProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-taskloop-blue" />
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
      </div>
      
      <div className="divide-y">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{apt.clientName}</h3>
                  <p className="text-sm text-gray-600">{apt.jobTitle}</p>
                  <p className="text-sm text-gray-600">{apt.address}</p>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {apt.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No appointments scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
