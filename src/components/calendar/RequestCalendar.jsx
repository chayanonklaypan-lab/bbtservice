import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { getCalendarEvents } from '../../services/calendarService';

const RequestCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getCalendarEvents();
      setEvents(
        data.map((item) => ({
          id: item.id,
          title: item.requestType || 'งานบริการ',
          start: item.scheduledAt ? item.scheduledAt.toDate?.() || item.scheduledAt : null,
          end: item.endAt ? item.endAt.toDate?.() || item.endAt : null,
          extendedProps: {
            status: item.status,
            requesterName: item.requesterName,
          },
        }))
      );
    };

    loadEvents();
  }, []);

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        events={events}
        editable
        selectable
        eventDisplay="block"
      />
    </Box>
  );
};

export default RequestCalendar;
