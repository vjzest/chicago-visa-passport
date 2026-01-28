"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { countries } from "@/data/countries";

export interface ICountryPair {
    _id: string;
    fromCountryCode: string;
    fromCountryName: string;
    toCountryCode: string;
    toCountryName: string;
    isJurisdictional: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export function useCountryAccess() {
    const [countryPairs, setCountryPairs] = useState<ICountryPair[]>([]);
    const [filteredPairs, setFilteredPairs] = useState<ICountryPair[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state for new country pair
    const [fromCountryCode, setFromCountryCode] = useState("");
    const [toCountryCode, setToCountryCode] = useState("");
    const [isJurisdictional, setIsJurisdictional] = useState(false);

    const fetchCountryPairs = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/admin/country-pairs");

            if (data.success) {
                setCountryPairs(data.data);
                setFilteredPairs(data.data);
            } else {
                toast.error("Failed to fetch country pairs");
            }
        } catch (error: any) {
            console.error("Error fetching country pairs:", error);
            toast.error(
                error?.response?.data?.message || "Error fetching country pairs"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCountryPairs();
    }, [fetchCountryPairs]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPairs(countryPairs);
        } else {
            const filtered = countryPairs.filter(
                (pair) =>
                    pair.fromCountryName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    pair.toCountryName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPairs(filtered);
        }
    }, [searchQuery, countryPairs]);

    const resetForm = useCallback(() => {
        setFromCountryCode("");
        setToCountryCode("");
        setIsJurisdictional(false);
    }, []);

    const handleAddCountryPair = useCallback(async () => {
        if (!fromCountryCode || !toCountryCode) {
            toast.error("Please select both 'From' and 'To' countries");
            return;
        }

        if (fromCountryCode === toCountryCode) {
            toast.error("'From' and 'To' countries cannot be the same");
            return;
        }

        const fromCountry = countries.find((c) => c.code === fromCountryCode);
        const toCountry = countries.find((c) => c.code === toCountryCode);

        if (!fromCountry || !toCountry) {
            toast.error("Invalid country selection");
            return;
        }

        try {
            setSaving(true);
            const { data } = await axiosInstance.post("/admin/country-pairs", {
                fromCountryCode: fromCountry.code,
                fromCountryName: fromCountry.name,
                toCountryCode: toCountry.code,
                toCountryName: toCountry.name,
                isJurisdictional,
            });

            if (data.success) {
                toast.success("Country pair added successfully");
                setIsDialogOpen(false);
                resetForm();
                fetchCountryPairs();
            } else {
                toast.error(data.message || "Failed to add country pair");
            }
        } catch (error: any) {
            console.error("Error adding country pair:", error);
            toast.error(
                error?.response?.data?.message || "Error adding country pair"
            );
        } finally {
            setSaving(false);
        }
    }, [fromCountryCode, toCountryCode, isJurisdictional, resetForm, fetchCountryPairs]);

    const handleToggleActive = useCallback(async (id: string, currentValue: boolean) => {
        try {
            const { data } = await axiosInstance.patch(
                `/admin/country-pairs/${id}/toggle-active`
            );

            if (data.success) {
                toast.success(data.message || "Country pair status updated successfully");
                setCountryPairs((prev) =>
                    prev.map((pair) =>
                        pair._id === id ? { ...pair, isActive: !currentValue } : pair
                    )
                );
            } else {
                toast.error("Failed to update country pair status");
            }
        } catch (error: any) {
            console.error("Error updating country pair:", error);
            toast.error(
                error?.response?.data?.message || "Error updating country pair"
            );
        }
    }, []);

    const handleToggleJurisdictional = useCallback(async (id: string, currentValue: boolean) => {
        try {
            const { data } = await axiosInstance.put(`/admin/country-pairs/${id}`, {
                isJurisdictional: !currentValue,
            });

            if (data.success) {
                toast.success("Country pair updated successfully");
                setCountryPairs((prev) =>
                    prev.map((pair) =>
                        pair._id === id
                            ? { ...pair, isJurisdictional: !currentValue }
                            : pair
                    )
                );
            } else {
                toast.error("Failed to update country pair");
            }
        } catch (error: any) {
            console.error("Error updating country pair:", error);
            toast.error(
                error?.response?.data?.message || "Error updating country pair"
            );
        }
    }, []);

    const closeDialogAndResetForm = useCallback(() => {
        setIsDialogOpen(false);
        resetForm();
    }, [resetForm]);

    return {
        // State
        countryPairs,
        filteredPairs,
        loading,
        searchQuery,
        isDialogOpen,
        saving,
        fromCountryCode,
        toCountryCode,
        isJurisdictional,

        // Setters
        setSearchQuery,
        setIsDialogOpen,
        setFromCountryCode,
        setToCountryCode,
        setIsJurisdictional,

        // Actions
        handleAddCountryPair,
        handleToggleActive,
        handleToggleJurisdictional,
        closeDialogAndResetForm,
    };
}
