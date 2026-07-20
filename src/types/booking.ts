// Публичные типы заявки для UI (клиент-безопасно, без Prisma-импортов).

export type BookingStatus =
  | "NEW"
  | "CONTACTED"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type BookingSource = "WEBSITE" | "PHONE" | "ADMIN";

// Строка заявки для списка админки (только нужные поля, без persональных
// служебных данных вроде idempotencyKey).
export type AdminBookingListItem = {
  publicId: string;
  status: BookingStatus;
  createdAt: string; // ISO
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  carName: string;
  carSlug: string;
  pickupDate: string; // ISO
  returnDate: string; // ISO
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  source: BookingSource;
};

// Полная заявка для страницы детали (комментарий + город получения).
export type AdminBookingDetail = AdminBookingListItem & {
  comment: string | null;
  cityName: string;
};

export type AdminBookingsPage = {
  items: AdminBookingListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
