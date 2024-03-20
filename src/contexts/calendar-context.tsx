import React, {createContext, useContext, useState} from 'react';

// Define the calendar context
interface CalendarContextProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    changeDateByDays: (days: number) => void;
    changeDateByWeeks: (weeks: number) => void;
    changeDateByMonths: (months: number) => void;
    changeDateByYears: (years: number) => void;
}

const CalendarContext = createContext<CalendarContextProps | undefined>({
    selectedDate: new Date(),
    setSelectedDate: () => {
    },
    changeDateByDays: () => {
    },
    changeDateByWeeks: () => {
    },
    changeDateByMonths: () => {
    },
    changeDateByYears: () => {
    },
});

// Define the custom hook to access the calendar context
export const useCalendarContext = (): CalendarContextProps => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }
    return context;
};

// Define the calendar provider component
export function CalendarProvider({children}: { children: React.ReactNode }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changeDateByDays = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const changeDateByWeeks = (weeks: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (weeks * 7));
        setSelectedDate(newDate);
    };

    const changeDateByMonths = (months: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + months);
        setSelectedDate(newDate);
    };

    const changeDateByYears = (years: number) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(selectedDate.getFullYear() + years);
        setSelectedDate(newDate);
    };

    return (
        <CalendarContext.Provider value={{
            selectedDate,
            setSelectedDate,
            changeDateByDays,
            changeDateByWeeks,
            changeDateByMonths,
            changeDateByYears
        }}>
            {children}
        </CalendarContext.Provider>
    );
}