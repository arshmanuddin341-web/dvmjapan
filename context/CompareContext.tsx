"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle } from "@/types";

interface CompareContextType {
    compareList: Vehicle[];
    addToCompare: (vehicle: Vehicle) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<Vehicle[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("dvm_compare_list");
        if (saved) {
            try {
                setCompareList(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse compare list", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("dvm_compare_list", JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (vehicle: Vehicle) => {
        if (compareList.length >= 4) {
            alert("You can compare up to 4 vehicles at a time.");
            return;
        }
        if (!compareList.find(v => v.id === vehicle.id)) {
            setCompareList([...compareList, vehicle]);
        }
    };

    const removeFromCompare = (id: string) => {
        setCompareList(compareList.filter(v => v.id !== id));
    };

    const clearCompare = () => setCompareList([]);

    const isInCompare = (id: string) => compareList.some(v => v.id === id);

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (!context) throw new Error("useCompare must be used within a CompareProvider");
    return context;
}
