import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import thLocale from '@fullcalendar/core/locales/th';
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
    <Box
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        minHeight: 640,
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        locale={thLocale}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        buttonText={{
          today: 'วันนี้',
          month: 'เดือน',
          week: 'สัปดาห์',
          day: 'วัน',
          list: 'รายการ',
        }}
        allDayText="ทั้งวัน"
        noEventsText="ไม่มีงานบริการ"
        titleFormat={{ year: 'numeric', month: 'long' }}
        dayHeaderFormat={{ weekday: 'short' }}
        events={events}
        editable
        selectable
        eventDisplay="block"
        height="auto"
        contentHeight="auto"
      />
    </Box>
  );
};

export default RequestCalendar;
