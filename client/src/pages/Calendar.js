// import React, { useState, useEffect } from "react";
// import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
// import format from "date-fns/format";
// import parse from "date-fns/parse";
// import startOfWeek from "date-fns/startOfWeek";
// import getDay from "date-fns/getDay";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Container, Typography, MenuItem, Select, Box, Tooltip } from "@mui/material";
// import API from "../api";

// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// function MyCalendar({ drawerOpen }) {
//   const [events, setEvents] = useState([]);
//   const [date, setDate] = useState(new Date());
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   const drawerWidth = 240; // Adjust if your drawer width is different

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const subjectsRes = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
//         let allEvents = [];

//         for (const s of subjectsRes.data) {
//           allEvents.push({
//             title: `📘 ${s.subjectName}`,
//             start: new Date(s.createdAt),
//             end: new Date(s.createdAt),
//             allDay: true,
//             type: "subject",
//             id: s._id,
//           });

//           const topicsRes = await API.get(`/topics/${s._id}`, { headers: { Authorization: `Bearer ${token}` } });
//           const topicEvents = topicsRes.data.map((t) => ({
//             title: `📘 ${s.subjectName}: 📝 ${t.title}`,
//             start: new Date(t.createdAt),
//             end: new Date(t.createdAt),
//             allDay: true,
//             type: "topic",
//             id: t._id,
//           }));

//           allEvents.push(...topicEvents);
//         }

//         setEvents(allEvents);
//       } catch (err) {
//         console.error("Failed to fetch subjects or topics", err);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const eventStyleGetter = (event) => {
//     const backgroundColor = event.type === "subject" ? "#6C5CE7" : "#FD79A8";
//     return {
//       style: {
//         backgroundColor,
//         borderRadius: "10px",
//         color: "white",
//         border: "none",
//         padding: "3px 6px",
//         fontSize: "0.85rem",
//         fontFamily: "'Poppins', sans-serif",
//         fontWeight: 500,
//         cursor: "pointer",
//       },
//     };
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

//   const CustomToolbar = ({ date, onDateChange }) => {
//     const months = Array.from({ length: 12 }, (_, i) => i);

//     const handleMonthChange = (e) => {
//       const newDate = new Date(date);
//       newDate.setMonth(e.target.value);
//       onDateChange(newDate);
//     };

//     const handleYearChange = (e) => {
//       const newDate = new Date(date);
//       newDate.setFullYear(e.target.value);
//       onDateChange(newDate);
//     };

//     return (
//       <Box display="flex" justifyContent="center" gap={2} mb={2}>
//         <Select value={date.getMonth()} onChange={handleMonthChange} sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
//           {months.map((m) => (
//             <MenuItem key={m} value={m}>
//               {format(new Date(date.getFullYear(), m), "MMMM")}
//             </MenuItem>
//           ))}
//         </Select>
//         <Select value={date.getFullYear()} onChange={handleYearChange} sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
//           {years.map((y) => (
//             <MenuItem key={y} value={y}>{y}</MenuItem>
//           ))}
//         </Select>
//       </Box>
//     );
//   };

//   const EventComponent = ({ event }) => (
//     <Tooltip title={event.title} arrow placement="top">
//       <span>{event.title}</span>
//     </Tooltip>
//   );

//   return (
//     <Container
//       maxWidth={false}
//       disableGutters
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         width: "100%",
//         overflow: "hidden",
//       }}
//     >
//       <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", color: "#2d3436", textAlign: "center" }}>
//         📅 Subjects & Topics Calendar
//       </Typography>

//       <CustomToolbar date={date} onDateChange={setDate} />

//       <Box
//         sx={{
//           height: `calc(100vh - 112px)`, // subtract the combined height of the header + toolbar
//           width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
//           transition: "width 0.3s ease",
//         }}
//       >
//         <BigCalendar
//           key={windowWidth} // re-render on window resize
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           defaultView="month"
//           views={["month"]}
//           date={date}
//           onNavigate={setDate}
//           style={{ height: "100%", width: "100%" }}
//           eventPropGetter={eventStyleGetter}
//           components={{ event: EventComponent }}
//           popup={true}
//         />
//       </Box>

//     </Container>
//   );
// }

// export default MyCalendar;


import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container, Typography, MenuItem, Select, Box, Tooltip } from "@mui/material";
import API from "../api";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function MyCalendar({ drawerOpen }) {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const drawerWidth = 240;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const subjectsRes = await API.get("/subjects", { headers: { Authorization: `Bearer ${token}` } });
        let allEvents = [];

        for (const s of subjectsRes.data) {
          allEvents.push({
            title: `📘 ${s.subjectName}`,
            start: new Date(s.createdAt),
            end: new Date(s.createdAt),
            allDay: true,
            type: "subject",
            id: s._id,
          });

          const topicsRes = await API.get(`/topics/${s._id}`, { headers: { Authorization: `Bearer ${token}` } });
          const topicEvents = topicsRes.data.map((t) => ({
            title: `📘 ${s.subjectName}: 📝 ${t.title}`,
            start: new Date(t.createdAt),
            end: new Date(t.createdAt),
            allDay: true,
            type: "topic",
            id: t._id,
          }));

          allEvents.push(...topicEvents);
        }

        setEvents(allEvents);
      } catch (err) {
        console.error("Failed to fetch subjects or topics", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.type === "subject" ? "#6C5CE7" : "#FD79A8",
      borderRadius: "10px",
      color: "white",
      border: "none",
      padding: "3px 6px",
      fontSize: "0.85rem",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      cursor: "pointer",
    },
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const CustomToolbar = ({ date, onDateChange }) => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    const handleMonthChange = (e) => {
      const newDate = new Date(date);
      newDate.setMonth(e.target.value);
      onDateChange(newDate);
    };

    const handleYearChange = (e) => {
      const newDate = new Date(date);
      newDate.setFullYear(e.target.value);
      onDateChange(newDate);
    };

    return (
      <Box display="flex" justifyContent="center" gap={2} mb={1}>
        <Select value={date.getMonth()} onChange={handleMonthChange} sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          {months.map((m) => (
            <MenuItem key={m} value={m}>
              {format(new Date(date.getFullYear(), m), "MMMM")}
            </MenuItem>
          ))}
        </Select>
        <Select value={date.getFullYear()} onChange={handleYearChange} sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          {years.map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </Box>
    );
  };

  const EventComponent = ({ event }) => (
    <Tooltip title={event.title} arrow placement="top">
      <span>{event.title}</span>
    </Tooltip>
  );

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: "0 0 auto" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "'Poppins', sans-serif", color: "#2d3436", textAlign: "center", mb: 1 }}>
          📅 Subjects & Topics Calendar
        </Typography>
        <CustomToolbar date={date} onDateChange={setDate} />
      </Box>

      <Box
        sx={{
          flex: "1 1 0", // takes remaining space exactly
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: "width 0.3s ease",
        }}
      >
        <BigCalendar
          key={windowWidth} // re-render on resize
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month"]}
          date={date}
          onNavigate={setDate}
          style={{ height: "100%", width: "100%" }}
          eventPropGetter={eventStyleGetter}
          components={{ event: EventComponent }}
          popup={true}
        />
      </Box>
    </Container>
  );
}

export default MyCalendar;
