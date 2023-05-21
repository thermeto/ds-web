import React, { useEffect, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import "./CreateDelievery.css";

interface PlacesAutocompleteProps {
  className?: string;
  placeholder?: string;
  onSelect: (position: { lat: number; lng: number }) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  className,
  placeholder = "Search an address",
  onSelect,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "UA" },
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect({ lat, lng });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      clearSuggestions();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className={className}
        placeholder={placeholder}
      />
      {status === "OK" && (
        <ul className="suggestion-list">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="suggestion-item"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
