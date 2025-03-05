import React, { useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditEventModal from '../EditEventModal/EditEventModal'; // Подключение EditEventModal
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
const EventsTable = ({ events, onEventUpdated }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // Для редактирования ивента
  const [openEditModal, setOpenEditModal] = useState(false); // Открытие/закрытие модалки редактирования

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (eventId) => {
    const event = events.find((e) => e._id === eventId); // Используем _id вместо id
    if (event) {
      setSelectedEvent(event); // Сохраняем все данные события, включая _id
      setOpenEditModal(true);
    } else {
      console.error('Событие не найдено');
    }
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const token = localStorage.getItem('token');

      console.log('Сохраняем изменения для события с ID:', updatedEvent._id); // Лог ID

      await axios.patch(
        `https://back.toptickets.com.ua/events/${updatedEvent._id}`, // Используем _id
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onEventUpdated(); // Вызов функции после редактирования события

      setOpenEditModal(false);
    } catch (error) {
      console.error(
        'Ошибка при редактировании ивента:',
        error.response?.data || error,
      );
    }
  };

  // Открытие диалогового окна для удаления
  const handleDelete = (eventId) => {
    setOpenDeleteDialog(true);
    setEventToDelete(eventId);
  };

  // Подтверждение удаления
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://back.toptickets.com.ua/events/${eventToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOpenDeleteDialog(false);
      setEventToDelete(null);
      onEventUpdated();
    } catch (error) {
      console.error('Ошибка при удалении ивента:', error);
    }
  };

  // Отмена удаления
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
                <TableRow key={event._id}>
                  <TableCell>
                    {format(new Date(event.date), 'd MMMM yyyy', {
                      locale: uk,
                    })}
                  </TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.sell_count}</TableCell>
                  <TableCell>{event.sell_count * event.price} грн</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(event._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event._id)}>
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

      {/* Модальное окно для редактирования ивента */}
      {selectedEvent && (
        <EditEventModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          eventData={selectedEvent} // Передаем данные текущего ивента для редактирования
          onSave={handleSaveEdit} // Функция сохранения после редактирования
        />
      )}

      {/* Диалог подтверждения удаления */}
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
