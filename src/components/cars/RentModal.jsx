import { BookingModal } from '../bookings/BookingModal';

export const RentModal = ({ isOpen, onClose, car }) => {
  return (
    <BookingModal
      isOpen={isOpen}
      onClose={onClose}
      preselectedCarId={car?.id}
    />
  );
};
