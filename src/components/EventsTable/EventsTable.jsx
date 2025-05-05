import React, { useState, useEffect } from 'react';
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
  Collapse,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import EditEventModal from '../EditEventModal/EditEventModal';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { CleaningServicesOutlined } from '@mui/icons-material';
// Добавьте эти импорты в начало файла
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
// import Box from '@mui/material/Box';

const EventsTable = ({ events, onEventUpdated }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [eventToClose, setEventToClose] = useState(null);
  const [openRowDetails, setOpenRowDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  // Инициализация фильтрованных событий при первой загрузке
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // Применение фильтров к событиям
  useEffect(() => {
    let filtered = [...events];

    // Поиск по названию
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Фильтр по дате начала
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((event) => new Date(event.date) >= fromDate);
    }

    // Фильтр по дате окончания
    if (dateTo) {
      const toDate = new Date(dateTo);
      // Устанавливаем время конца дня
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((event) => new Date(event.date) <= toDate);
    }

    // Фильтр по активным событиям
    if (showActiveOnly) {
      filtered = filtered.filter((event) => !event.ended);
    }

    setFilteredEvents(filtered);
    setPage(0); // Сбрасываем страницу при изменении фильтров
  }, [events, searchQuery, dateFrom, dateTo, showActiveOnly]);

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
      console.error('Подія не знайдена');
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
        'Помилка при редагуванні події:',
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
        'Помилка при видаленні події:',
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
        'Помилка при закритті продажу:',
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

  const toggleRowDetails = (eventId) => {
    setOpenRowDetails((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Функция для отображения суммы
  const calculateTotalAmount = (event) => {
    // Если есть отчет, просто используем готовое значение price из него
    if (event.report && event.report.price !== undefined) {
      return `${formatNumber(event.report.price)} грн`;
    }

    // Если отчета нет, возвращаем 0
    return '0 грн';
  };

  // Функция для форматирования числа с разделителями
  const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return Number(number).toLocaleString('uk-UA');
  };

  // Функция для получения корректного количества проданных билетов
  const getSoldTicketsCount = (event) => {
    if (event.report && event.report.tickets_sell !== undefined) {
      return event.report.tickets_sell;
    }
    return event.sell_count || 0;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setShowActiveOnly(false);
  };

  return (
    <>
      {/* Фильтры и поиск */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Пошук за назвою"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              id="date-from"
              label="Дата від"
              type="date"
              size="small"
              fullWidth
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              id="date-to"
              label="Дата до"
              type="date"
              size="small"
              fullWidth
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                  />
                }
                label="Тільки активні події"
              />

              <Button
                startIcon={<ClearIcon fontSize="small" sx={{ mr: -0.5 }} />}
                onClick={resetFilters}
                variant="outlined"
                size="small"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Скинути
              </Button>

              <Button
                startIcon={<RefreshIcon fontSize="small" sx={{ mr: -0.5 }} />}
                onClick={onEventUpdated}
                disabled={false} // Установите здесь isLoading, если у вас есть такое состояние
                variant="outlined"
                size="small"
                color="primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Оновити
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Таблица с событиями */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="70px">Деталі</TableCell>
              <TableCell>Початок</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Продано квитків</TableCell>
              <TableCell>Сума</TableCell>
              <TableCell>Продаж квитків</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((event) => {
                const eventId = event._id || event.id;
                const isSellClosed = event.sellEnded || false;
                const hasReport =
                  event.report !== null && event.report !== undefined;
                const ticketsSold = getSoldTicketsCount(event);
                const isActive = !event.ended;

                return (
                  <React.Fragment key={eventId}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="Деталі звіту"
                          size="small"
                          onClick={() => toggleRowDetails(eventId)}
                          disabled={!hasReport}
                        >
                          {hasReport ? (
                            openRowDetails[eventId] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )
                          ) : (
                            <InfoIcon color="disabled" />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {format(new Date(event.date), 'd MMMM yyyy', {
                          locale: uk,
                        })}
                      </TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{formatNumber(ticketsSold)}</TableCell>
                      <TableCell>{calculateTotalAmount(event)}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            icon={
                              isSellClosed ? (
                                <BlockIcon />
                              ) : (
                                <ShoppingCartIcon />
                              )
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
                        <IconButton
                          onClick={() => handleDelete(eventId)}
                          disabled={isActive} // Блокируем кнопку удаления для активных событий
                          title={
                            isActive
                              ? 'Неможливо видалити активну подію'
                              : 'Видалити подію'
                          }
                        >
                          <DeleteIcon
                            color={isActive ? 'disabled' : 'inherit'}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={openRowDetails[eventId] && hasReport}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              margin: 1,
                              padding: 2,
                              backgroundColor: '#f5f5f5',
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Звіт з продажів
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Продано квитків</TableCell>
                                  <TableCell>Загальна сума (грн)</TableCell>
                                  <TableCell>Сервісний збір (грн)</TableCell>
                                  <TableCell>Комісія LiqPay (грн)</TableCell>
                                  <TableCell>Підсумок (грн)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {hasReport && (
                                  <TableRow>
                                    <TableCell>
                                      {formatNumber(event.report.tickets_sell)}
                                    </TableCell>
                                    <TableCell>
                                      {formatNumber(event.report.price)}
                                    </TableCell>
                                    <TableCell>
                                      {formatNumber(event.report.serviceFee)}
                                    </TableCell>
                                    <TableCell>
                                      {formatNumber(
                                        event.report.lp_receiver_commission,
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {formatNumber(event.report.total)}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Рядків на сторінці:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} з ${count !== -1 ? count : 'більше ніж ' + to}`
        }
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
        <DialogTitle>Видалити подію?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цю подію? Ця дія не може бути
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
            Ви впевнені, що хочете закрити продаж квитків для цієї події? Після
            закриття продажу квитків відновити його буде неможливо.
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
