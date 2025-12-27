import { useState } from 'react';
import { FiSearch, FiMapPin, FiCompass } from 'react-icons/fi';

const Hero = () => {
  const [nearby, setNearby] = useState<any[] | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [areaLabel, setAreaLabel] = useState<string | null>(null);

  const fetchNearby = async (lat: number, lng: number) => {
    try {
      setLocLoading(true);
      setLocError(null);
      const res = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}&radiusKm=30`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'failed');
      setNearby(data.restaurants || []);
    } catch (err: any) {
      setLocError(err?.message || String(err));
      setNearby(null);
    } finally {
      setLocLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setAreaLabel(`Near you • ${lat.toFixed(2)}, ${lng.toFixed(2)}`);
        fetchNearby(lat, lng);
      },
      (err) => {
        setLocError(err.message || 'permission denied');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFindFood = async () => {
    if (!address || address.trim().length < 2) {
      setSearchError('Please enter an address or area');
      return;
    }
    try {
      setSearchLoading(true);
      setSearchError(null);
      setNearby(null);
      setAreaLabel(`Searching near “${address}”`);
      const res = await fetch(`/api/restaurants?address=${encodeURIComponent(address)}&radiusKm=30`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'No results');
      setNearby(data.restaurants || []);
    } catch (err: any) {
      setSearchError(err?.message || String(err));
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-neutral-white via-warm-cream to-orange-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-neutral-charcoal z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Delicious Food <br />
              <span className="text-primary drop-shadow-lg">Delivered to You</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-dark mb-8 max-w-lg">
              All three courses delivered right to your doorsteps.
            </p>
            
            {/* Stylish Search Bar */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full max-w-3xl bg-white rounded-3xl p-2 shadow-2xl border border-neutral-light">
                <div className="flex items-center px-3 text-neutral-dark">
                  <FiSearch size={18} />
                </div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Search for address, area or landmark"
                  className="flex-1 px-4 py-3 rounded-2xl text-gray-700 outline-none text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-0">
                  <button
                    onClick={handleFindFood}
                    className="px-4 py-2 rounded-full bg-transparent border border-primary text-primary font-semibold shadow-lg hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105"
                  >
                    {searchLoading ? 'Searching...' : 'Find Food'}
                  </button>
                  <button
                    onClick={requestLocation}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-light text-neutral-dark hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-105"
                  >
                    <FiMapPin />
                    {locLoading ? 'Locating...' : 'Use my location'}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-sm text-neutral-dark">
                <FiCompass />
                <div>
                  <div className="font-medium text-sm text-neutral-charcoal">{areaLabel || 'Search by address or use your location'}</div>
                  <div className="text-xs text-muted">
                    {searchError || locError ? <span className="text-red-600">{searchError || locError}</span> : 'We’ll show nearby restaurants and delivery estimates.'}
                  </div>
                </div>
              </div>
            </div>
            {/* Nearby restaurants list */}
            <div className="mt-6 max-w-lg">
              {locError && <div className="text-sm text-red-600">{locError}</div>}
              {nearby && nearby.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <h4 className="text-lg font-semibold mb-2">Nearby restaurants</h4>
                  <ul className="space-y-2">
                    {nearby.map((r: any) => (
                      <li key={r._id || r.name} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.name}</div>
                          {r.description && <div className="text-sm text-muted">{r.description}</div>}
                        </div>
                        <div className="text-sm text-neutral-dark">{r.distanceKm ? `${r.distanceKm} km` : ''}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">750+</h3>
                <p className="text-sm text-neutral-dark">Restaurants</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">100K+</h3>
                <p className="text-sm text-neutral-dark">Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">15min</h3>
                <p className="text-sm text-neutral-dark">Avg Delivery</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              {/* First Image */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 -mt-8">
                <img 
                  src="/lb-1.jpg" 
                  alt="Delicious food delivery" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Second Image */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 mt-12">
                <img 
                  src="/lb-2.jpg" 
                  alt="Fresh meals" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-orange-light">
              <p className="text-primary font-bold text-sm">⚡ Fast Delivery</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-medium/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-warm-peach/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-light/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
