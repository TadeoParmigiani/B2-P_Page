interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateChange }: CalendarProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" };
    return date.toLocaleDateString("es-AR", options);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = () => {
    if (isToday(selectedDate)) return "Hoy";
    if (isTomorrow(selectedDate)) return "Mañana";
    return selectedDate.toLocaleDateString("es-AR", { weekday: "long" });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => changeDate(-1)}
        className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isToday(selectedDate)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--gray-100)] rounded-lg">
        <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium capitalize">{getDateLabel()} {formatDate(selectedDate)}</span>
      </div>
      <button
        type="button"
        onClick={() => changeDate(1)}
        className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default Calendar;