import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditEventModal from '../EditEventModal/EditEventModal';

// Sample data
const initialEvents = [
  {
    id: 1,
    title: 'Event 1',
    description: 'Description for Event 1',
    date: '2024-08-01',
    time: '18:00',
    price: 200,
    image: 'event1.jpg',
    place: 'Venue 1',
    ticketsSold: 100,
  },
  {
    id: 2,
    title: 'Event 2',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 150,
  },
  {
    id: 3,
    title: 'Event 2',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 150,
  },
  {
    id: 4,
    title: 'Event 2',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 150,
  },
  {
    id: 5,
    title: 'Event 2',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 140,
  },
  {
    id: 6,
    title: 'Event 2',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 150,
  },
  {
    id: 7,
    title: 'Event LEsha looox',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 150,
  },
  {
    id: 8,
    title: 'Event LEsha looox',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 15,
  },
  {
    id: 9,
    title: 'Event LEsha looox',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 1,
  },
  {
    id: 10,
    title: 'Event LEsha looox',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 1,
  },
  {
    id: 11,
    title: 'Event LEsha looox',
    description: 'Description for Event 2',
    date: '2024-08-02',
    time: '19:00',
    price: 350,
    image: 'event2.jpg',
    place: 'Venue 2',
    ticketsSold: 1,
  },
  // Add more sample events here...
];

const EventsTable = () => {
  const [events, setEvents] = useState(initialEvents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
    setOpenEditModal(true);
  };

  const handleSaveEdit = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
    setOpenEditModal(false);
  };

  const handleDelete = (eventId) => {
    setOpenDeleteDialog(true);
    setEventToDelete(eventId);
  };

  const confirmDelete = () => {
    setEvents(events.filter((event) => event.id !== eventToDelete));
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Початок</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Продано квитків</TableCell>
              <TableCell>Сума</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {event.date} {event.time}
                  </TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.ticketsSold}</TableCell>
                  <TableCell>{event.ticketsSold * event.price} грн</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(event.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          eventData={selectedEvent}
          onSave={handleSaveEdit}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Видалити івент?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цей івент? Ця дія не може бути
            скасована.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Скасувати</Button>
          <Button onClick={confirmDelete} color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventsTable;
