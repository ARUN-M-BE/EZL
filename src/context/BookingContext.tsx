import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Instructor, Package } from '../../types';

export interface BookingState {
    instructor: Instructor | null;
    package: Package | null;
    date: string | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'learner' | 'instructor';
}

interface BookingContextType {
    booking: BookingState;
    setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
    comparisonList: Instructor[];
    addToCompare: (i: Instructor) => void;
    removeFromCompare: (id: string) => void;
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [booking, setBooking] = useState<BookingState>({ instructor: null, package: null, date: null });
    const [comparisonList, setComparisonList] = useState<Instructor[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Clear sensitive booking data if needed
        setBooking({ instructor: null, package: null, date: null });
    };

    const addToCompare = (inst: Instructor) => {
        if (!comparisonList.find(i => i.id === inst.id) && comparisonList.length < 3) {
            setComparisonList([...comparisonList, inst]);
        }
    };

    const removeFromCompare = (id: string) => {
        setComparisonList(comparisonList.filter(i => i.id !== id));
    };

    return (
        <BookingContext.Provider value={{ booking, setBooking, comparisonList, addToCompare, removeFromCompare, user, login, logout }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
