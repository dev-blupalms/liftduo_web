'use client';

import { useEffect } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { Input } from './Input';

interface PlacesAutocompleteProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string, placeId: string) => void;
    types?: string[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    id?: string;
}

export function PlacesAutocomplete({
    label,
    value,
    onChange,
    onSelect,
    types,
    placeholder,
    error,
    disabled,
    id
}: PlacesAutocompleteProps) {
    const {
        ready,
        value: inputValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
        init
    } = usePlacesAutocomplete({
        requestOptions: {
            types: types || ['address'],
        },
        debounce: 300,
        defaultValue: value,
        initOnMount: false,
    });

    // Sync local state with prop value changes
    useEffect(() => {
        setValue(value, false);
    }, [value, setValue]);

    // Initialize when the Google Maps script is ready
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
            init();
        }
    }, [init]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    const handleSelect = (placeId: string, description: string) => {
        setValue(description, false);
        clearSuggestions();
        onSelect(description, placeId);
    };

    return (
        <div className="relative w-full">
            <Input
                id={id}
                label={label}
                value={inputValue}
                onChange={handleInput}
                disabled={!ready || disabled}
                placeholder={placeholder}
                error={error}
                autoComplete="off"
            />
            {status === 'OK' && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
                    {data.map(({ place_id, description }) => (
                        <li
                            key={place_id}
                            onClick={() => handleSelect(place_id, description)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                            {description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
