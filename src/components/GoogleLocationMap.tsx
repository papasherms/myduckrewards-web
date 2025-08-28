import React, { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

interface LocationMapProps {
  locations: Array<{
    id: string
    name: string
    address: string
    city: string
    state: string
    zip_code: string
    latitude?: number
    longitude?: number
    machine_capacity?: number
  }>
  center?: { lat: number; lng: number }
  zoom?: number
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.75rem'
}

const defaultCenter = {
  lat: 42.3314,
  lng: -83.0458 // Detroit area
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
}

const GoogleLocationMap: React.FC<LocationMapProps> = ({ 
  locations, 
  center = defaultCenter, 
  zoom = 11 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  
  // Log API key status (without exposing the key)
  console.log('Google Maps API Key configured:', apiKey ? 'Yes' : 'No')
  if (!apiKey) {
    console.error('VITE_GOOGLE_MAPS_API_KEY is not set in environment variables')
  }
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places']
  })

  const [, setMap] = useState<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          bounds.extend({ lat: location.latitude, lng: location.longitude })
        } else {
          // Generate demo coordinates for locations without lat/lng
          const offset = 0.05
          const index = locations.indexOf(location)
          const angle = (index * 2 * Math.PI) / locations.length
          bounds.extend({
            lat: defaultCenter.lat + offset * Math.sin(angle),
            lng: defaultCenter.lng + offset * Math.cos(angle)
          })
        }
      })
      map.fitBounds(bounds)
    }
    setMap(map)
  }, [locations])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const getLocationCoordinates = (location: any, index: number): { lat: number; lng: number } => {
    if (location.latitude && location.longitude) {
      return { lat: location.latitude, lng: location.longitude }
    }
    // Generate demo coordinates around Detroit area
    const offset = 0.05
    const angle = (index * 2 * Math.PI) / locations.length
    return {
      lat: defaultCenter.lat + offset * Math.sin(angle),
      lng: defaultCenter.lng + offset * Math.cos(angle)
    }
  }

  if (loadError) {
    console.error('Google Maps Load Error:', loadError)
    return (
      <div className="w-full h-[500px] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-600 dark:text-gray-400 mb-2 font-semibold">Error loading Google Maps</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
            {loadError.message || 'Please check your API key configuration'}
          </p>
          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>To fix this:</p>
            <ol className="text-left list-decimal list-inside">
              <li>Ensure VITE_GOOGLE_MAPS_API_KEY is set in your .env file</li>
              <li>Verify the API key has Maps JavaScript API enabled</li>
              <li>Check that billing is enabled on your Google Cloud project</li>
              <li>Restart the development server after updating .env</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duck-500"></div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {locations.map((location, index) => {
        const position = getLocationCoordinates(location, index)
        return (
          <Marker
            key={location.id}
            position={position}
            onClick={() => setSelectedLocation(location)}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#shadow)">
                    <path d="M20 0C8.95 0 0 8.95 0 20c0 15 20 30 20 30s20-15 20-30c0-11.05-8.95-20-20-20z" fill="#FCD34D"/>
                    <circle cx="20" cy="20" r="15" fill="#F59E0B"/>
                    <text x="20" y="26" text-anchor="middle" font-size="18" fill="white">🦆</text>
                  </g>
                  <defs>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                    </filter>
                  </defs>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 50),
              anchor: new google.maps.Point(20, 50)
            }}
          />
        )
      })}

      {selectedLocation && (
        <InfoWindow
          position={getLocationCoordinates(
            selectedLocation,
            locations.indexOf(selectedLocation)
          )}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="p-2" style={{ minWidth: '200px' }}>
            <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedLocation.address}<br />
              {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip_code}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-medium">
                🦆 {selectedLocation.machine_capacity || 100} ducks
              </span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.state} ${selectedLocation.zip_code}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Get Directions →
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default GoogleLocationMap