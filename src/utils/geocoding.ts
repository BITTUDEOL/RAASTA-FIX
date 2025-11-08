export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    if (!response.ok) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

export const getDemoLocation = (): { lat: number; lng: number } => {
  const demoLocations = [
    { lat: 28.6139, lng: 77.2090, name: 'New Delhi' },
    { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
    { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
    { lat: 13.0827, lng: 80.2707, name: 'Chennai' }
  ];

  const location = demoLocations[Math.floor(Math.random() * demoLocations.length)];

  return {
    lat: location.lat + (Math.random() - 0.5) * 0.05,
    lng: location.lng + (Math.random() - 0.5) * 0.05
  };
};
