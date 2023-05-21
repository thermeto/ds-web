import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer, Circle } from "@react-google-maps/api";
import "./CreateDelievery.css";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 50.45466,
  lng: 30.5238,
};

interface MapProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onDistanceChange: (distance: number) => void;
  onDurationChange: (duration: number) => void;
}

const Map: FC<MapProps> = ({
  origin,
  destination,
  onDistanceChange,
  onDurationChange,
}) => {
  const directionsServiceRef = useRef<google.maps.DirectionsService>();
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer>();
  const mapRef = useRef<google.maps.Map>();
  const [initialZoomPerformed, setInitialZoomPerformed] = useState(false);

  const [prevLocations, setPrevLocations] = useState<{
    origin: { lat: number; lng: number } | null;
    destination: { lat: number; lng: number } | null;
  }>({ origin: null, destination: null });

  const zoomToOrigin = () => {
    console.log('zoomToOrigin called');
    if (origin && mapRef.current) {
      console.log('origin and mapRef.current are defined');
      const targetZoom = 16;
      const zoomStep = 0.5; // Change the zoom step to 1
      const intervalTime = 200; // Change the interval time to 250ms

      mapRef.current.panTo(origin);

      const currentZoom = mapRef.current.getZoom() || 0;
      const zoomIn = currentZoom < targetZoom;

      const zoomGradually = () => {
        if (mapRef.current) {
          const newZoom = (mapRef.current.getZoom() || 0) + (zoomIn ? zoomStep : -zoomStep);

          if ((zoomIn && newZoom >= targetZoom) || (!zoomIn && newZoom <= targetZoom)) {
            console.log('Reached target zoom:', targetZoom);
            mapRef.current.setZoom(targetZoom);
          } else {
            console.log('New zoom:', newZoom);
            mapRef.current.setZoom(newZoom);
            setTimeout(zoomGradually, intervalTime);
          }
        }
      };

      zoomGradually();
    }
  };

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(map);
    },
    []
  );

  useEffect(() => {
    if (
      (prevLocations.origin !== origin || prevLocations.destination !== destination) &&
      origin &&
      destination
    ) {
      setPrevLocations({ origin, destination });
      setTimeout(zoomToOrigin, 3000);
    }
  }, [origin, destination, prevLocations]);

  useEffect(() => {
    if (
      directionsServiceRef.current &&
      directionsRendererRef.current &&
      origin &&
      destination
    ) {
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsServiceRef.current.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);

          const distance = result?.routes?.[0]?.legs?.[0]?.distance?.value;
          const duration = result?.routes?.[0]?.legs?.[0]?.duration?.value;

          if (distance !== undefined && duration !== undefined) {
            onDistanceChange(distance);
            onDurationChange(duration);
          }
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      });
    }
  }, [origin, destination, onDistanceChange, onDurationChange]);

  useEffect(() => {
    if (!initialZoomPerformed && origin && destination) {
      console.log('Initial zoom not performed and origin and destination are defined');
      setInitialZoomPerformed(true);
      setTimeout(zoomToOrigin, 3000);
    }
  }, [origin, destination, initialZoomPerformed]);



  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={10}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [
              { saturation: -100 },
              { lightness: 50 },
            ],
          },
        ],
      }}
      onLoad={onLoad}
    >
      {origin && (
        <Circle
          center={origin}
          radius={500} // Set the desired radius in meters
          options={{
            strokeColor: "#0000ff",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#0000ff",
            fillOpacity: 0.05,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;