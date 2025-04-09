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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EditEventModal from '../EditEventModal/EditEventModal';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const EventsTable = ({ events, onEventUpdated }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [eventToClose, setEventToClose] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (eventId) => {
    const event = events.find((e) => e._id === eventId || e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setOpenEditModal(true);
    } else {
      console.error('Событие не найдено');
    }
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const token = localStorage.getItem('token');
      const eventId = updatedEvent._id || updatedEvent.id;

      await axios.patch(`${API_URL}/events-bo/${eventId}`, updatedEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onEventUpdated();
      setOpenEditModal(false);
    } catch (error) {
      console.error(
        'Ошибка при редактировании ивента:',
        error.response?.data || error,
      );
    }
  };

  const handleDelete = (eventId) => {
    setOpenDeleteDialog(true);
    setEventToDelete(eventId);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const eventId = eventToDelete;

      await axios.delete(`${API_URL}/events-bo/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOpenDeleteDialog(false);
      setEventToDelete(null);
      onEventUpdated();
    } catch (error) {
      console.error(
        'Ошибка при удалении ивента:',
        error.response?.data || error,
      );
    }
  };

  const handleOpenCloseDialog = (eventId, isSellClosed) => {
    if (isSellClosed) {
      return;
    }
    setEventToClose(eventId);
    setOpenCloseDialog(true);
  };

  const handleCloseSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const eventId = eventToClose;

      await axios.post(
        `${API_URL}/events-bo/close`,
        { eventId: eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOpenCloseDialog(false);
      setEventToClose(null);
      onEventUpdated();
    } catch (error) {
      console.error(
        'Ошибка при закрытии продажи:',
        error.response?.data || error,
      );
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const cancelCloseDialog = () => {
    setOpenCloseDialog(false);
    setEventToClose(null);
  };

  // Функция для правильного отображения цены
  const calculateTotalAmount = (event) => {
    // Проверяем разные форматы данных, которые могут быть у ивента
    let sellCount = event.sell_count || 0;
    let price = 0;

    // Определяем цену в зависимости от структуры данных
    if (event.price) {
      price = Number(event.price);
    } else if (event.prices && event.prices.length > 0) {
      price = Number(event.prices[0].price || 0);
    }

    // Проверяем, что оба значения - числа и возвращаем результат с форматированием
    if (isNaN(sellCount) || isNaN(price)) {
      return '0 грн';
    }

    return `${(sellCount * price).toLocaleString('uk-UA')} грн`;
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
              <TableCell>Продаж квитків</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event) => {
                const eventId = event._id || event.id;
                const isSellClosed = event.sellEnded || false;

                return (
                  <TableRow key={eventId}>
                    <TableCell>
                      {format(new Date(event.date), 'd MMMM yyyy', {
                        locale: uk,
                      })}
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.sell_count || 0}</TableCell>
                    <TableCell>{calculateTotalAmount(event)}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          icon={
                            isSellClosed ? <BlockIcon /> : <ShoppingCartIcon />
                          }
                          label={
                            isSellClosed ? 'Продаж закритий' : 'Йде продаж'
                          }
                          color={isSellClosed ? 'error' : 'success'}
                          variant="outlined"
                          style={{ marginRight: '8px' }}
                        />
                        <IconButton
                          onClick={() =>
                            handleOpenCloseDialog(eventId, isSellClosed)
                          }
                          disabled={isSellClosed}
                          title={
                            isSellClosed
                              ? 'Продаж уже закритий'
                              : 'Закрити продаж квитків'
                          }
                        >
                          <BlockIcon
                            color={isSellClosed ? 'disabled' : 'primary'}
                          />
                        </IconButton>
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(eventId)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(eventId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          eventData={selectedEvent}
          onSave={handleSaveEdit}
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

      {/* Диалог закрытия продажи */}
      <Dialog open={openCloseDialog} onClose={cancelCloseDialog}>
        <DialogTitle>Закрити продаж квитків?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете закрити продаж квитків для цього івенту?
            Після закриття продажу квитків відновити його буде неможливо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelCloseDialog}>Скасувати</Button>
          <Button onClick={handleCloseSales} color="error">
            Закрити продаж
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventsTable;
