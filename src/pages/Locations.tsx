import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Navigation, Clock, Phone, ExternalLink } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import usePageTitle from '../hooks/usePageTitle'

interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  machine_capacity: number
  is_active: boolean
}

const Locations: React.FC = () => {
  usePageTitle('Find Locations')
  const { userProfile } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [searchZip, setSearchZip] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchMode, setSearchMode] = useState<'zip' | 'nearby'>('zip')

  useEffect(() => {
    // Pre-fill with user's zip if available
    if (userProfile?.zip_code && !searchZip) {
      setSearchZip(userProfile.zip_code)
    }
    fetchLocations()
  }, [userProfile])

  const fetchLocations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (!error && data) {
      setLocations(data)
    }
    setLoading(false)
  }

  const handleSearch = () => {
    // In a real app, this would filter locations by zip code
    // For now, just show all locations
    fetchLocations()
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setSearchMode('nearby')
          // In a real app, this would find nearby locations
          fetchLocations()
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enter a ZIP code.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  const openInMaps = (location: Location) => {
    const address = encodeURIComponent(`${location.address}, ${location.city}, ${location.state} ${location.zip_code}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-duck-50 dark:from-blue-900/20 dark:to-duck-900/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">📍</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Duck Machine Locations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Locate our bright yellow claw machines at Leo's Coney Island restaurants throughout Southeast Michigan
          </p>
        </motion.div>

        {/* Search Section */}
        <AnimatedCard className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter ZIP Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchZip}
                      onChange={(e) => setSearchZip(e.target.value)}
                      placeholder="Enter ZIP code (e.g., 48084)"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-duck-500 focus:border-duck-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      maxLength={5}
                    />
                  </div>
                  <AnimatedButton
                    variant="primary"
                    size="md"
                    icon={<Search size={20} />}
                    onClick={handleSearch}
                  >
                    Search
                  </AnimatedButton>
                </div>
              </div>
              <div className="flex items-end">
                <AnimatedButton
                  variant="outline"
                  size="md"
                  icon={<Navigation size={20} />}
                  onClick={handleUseCurrentLocation}
                  className="w-full"
                >
                  Use Current Location
                </AnimatedButton>
              </div>
            </div>
            
            {userProfile && !userProfile.zip_code && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
              >
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 Tip: Update your profile with your ZIP code for faster searches
                </p>
              </motion.div>
            )}
          </div>
        </AnimatedCard>

        {/* Map Placeholder */}
        <AnimatedCard className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Map
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 dark:text-gray-400">
                  Map integration coming soon!
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  For now, view locations in the list below
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Locations List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {searchMode === 'nearby' ? 'Nearby Locations' : 'All Locations'}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duck-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading locations...</p>
            </div>
          ) : locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <AnimatedCard key={location.id} delay={index * 0.1}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {location.name}
                      </h3>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                        Open
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <MapPin className="text-gray-400 mr-2 mt-0.5" size={16} />
                        <div className="text-gray-600 dark:text-gray-400">
                          {location.address}<br />
                          {location.city}, {location.state} {location.zip_code}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="text-gray-400 mr-2" size={16} />
                        <span className="text-gray-600 dark:text-gray-400">
                          Daily: 7:00 AM - 10:00 PM
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="text-gray-400 mr-2" size={16} />
                        <span className="text-gray-600 dark:text-gray-400">
                          (248) 555-0{100 + index}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="text-2xl mr-2">🦆</div>
                        <span className="text-gray-600 dark:text-gray-400">
                          {location.machine_capacity} ducks available
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => openInMaps(location)}
                        className="w-full flex items-center justify-center text-duck-600 dark:text-duck-400 hover:text-duck-700 dark:hover:text-duck-300 font-medium text-sm"
                      >
                        <ExternalLink className="mr-2" size={16} />
                        Get Directions
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <AnimatedCard>
              <div className="p-12 text-center">
                <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No Locations Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchZip 
                    ? `No locations found near ZIP code ${searchZip}`
                    : 'Enter a ZIP code to search for nearby locations'}
                </p>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default Locations