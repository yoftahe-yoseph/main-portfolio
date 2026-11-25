'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  AlertCircle,
  ArrowUpRight,
  Compass,
  Loader2,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  INITIAL_MAP_VIEW,
  MAPS_ATTRIBUTION_IDS,
  MAPS_END_USER_TERMS_URL,
  MAPS_PRIVACY_URL,
  MAPS_QUOTA_EVENT,
  PORTFOLIO_HUB_QUERIES,
  isMapsQuotaError,
  type PortfolioHubQuery,
} from '@/lib/maps-utils';

interface ResolvedPlace {
  id: string;
  hubId?: string;
  hubLabel?: string;
  regionTag?: string;
  roleContext?: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  viewport?: google.maps.LatLngBounds | null;
  googleMapsURI?: string | null;
}

interface HubMarkerProps {
  place: ResolvedPlace;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}

function HubMarkerWithInfo({ place, isSelected, onSelect, onClose }: HubMarkerProps) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={place.location}
        title={place.displayName}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#2563EB' : '#0F172A'}
          borderColor={isSelected ? '#1D4ED8' : '#334155'}
          glyphColor="#FFFFFF"
          scale={isSelected ? 1.15 : 1}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow anchor={marker} onCloseClick={onClose} maxWidth={290}>
          <div className="p-1 text-slate-900 space-y-1.5">
            {place.regionTag && (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                {place.regionTag}
              </p>
            )}
            <h3 className="font-display text-sm font-bold text-slate-900 leading-snug">
              {place.displayName}
            </h3>
            {place.formattedAddress && (
              <p className="text-xs text-slate-600 leading-relaxed">{place.formattedAddress}</p>
            )}
            {place.roleContext && (
              <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                {place.roleContext}
              </p>
            )}
            {place.googleMapsURI && (
              <a
                href={place.googleMapsURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-blue-600 hover:text-blue-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function toLatLngLiteral(
  loc: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined
): google.maps.LatLngLiteral | null {
  if (!loc) return null;
  if (typeof (loc as google.maps.LatLng).lat === 'function') {
    const latLng = loc as google.maps.LatLng;
    return { lat: latLng.lat(), lng: latLng.lng() };
  }
  const literal = loc as google.maps.LatLngLiteral;
  if (typeof literal.lat === 'number' && typeof literal.lng === 'number') {
    return { lat: literal.lat, lng: literal.lng };
  }
  return null;
}

function MapExplorerWorkspace() {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();

  const [hubPlaces, setHubPlaces] = useState<ResolvedPlace[]>([]);
  const [searchPlace, setSearchPlace] = useState<ResolvedPlace | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isLoadingHubs, setIsLoadingHubs] = useState(false);
  const [activeHubQueryId, setActiveHubQueryId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Modern Place Autocomplete (New) state with session token management
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isResolvingSelection, setIsResolvingSelection] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const hubsFetchedRef = useRef(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const triggerQuotaIfNeeded = useCallback((err: unknown) => {
    if (isMapsQuotaError(err)) {
      window.dispatchEvent(new CustomEvent(MAPS_QUOTA_EVENT));
    }
  }, []);

  const focusMapOnPlace = useCallback(
    (place: ResolvedPlace) => {
      if (!map) return;
      if (place.viewport) {
        map.fitBounds(place.viewport, 48);
      } else {
        map.panTo(place.location);
        map.setZoom(12);
      }
    },
    [map]
  );

  // Resolve Yoftahe's portfolio hub locations dynamically via modern Places API (New)
  useEffect(() => {
    if (!placesLib || hubsFetchedRef.current) return;
    hubsFetchedRef.current = true;

    let cancelled = false;
    setIsLoadingHubs(true);
    setStatusError(null);

    const resolveHub = async (hub: PortfolioHubQuery): Promise<ResolvedPlace | null> => {
      const { places } = await placesLib.Place.searchByText({
        textQuery: hub.searchQuery,
        fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport', 'googleMapsURI'],
        maxResultCount: 1,
      });

      const match = places?.[0];
      const location = toLatLngLiteral(match?.location);
      if (!match || !location) return null;

      return {
        id: match.id || hub.id,
        hubId: hub.id,
        hubLabel: hub.label,
        regionTag: hub.regionTag,
        roleContext: hub.roleContext,
        displayName: match.displayName || hub.label,
        formattedAddress: match.formattedAddress || '',
        location,
        viewport: match.viewport ?? null,
        googleMapsURI: match.googleMapsURI ?? null,
      };
    };

    (async () => {
      try {
        const settled = await Promise.allSettled(PORTFOLIO_HUB_QUERIES.map(resolveHub));
        if (cancelled) return;

        const resolved: ResolvedPlace[] = [];
        let sawQuota = false;

        for (const item of settled) {
          if (item.status === 'fulfilled' && item.value) {
            resolved.push(item.value);
          } else if (item.status === 'rejected') {
            if (isMapsQuotaError(item.reason)) {
              sawQuota = true;
            }
          }
        }

        if (sawQuota) {
          window.dispatchEvent(new CustomEvent(MAPS_QUOTA_EVENT));
        }

        setHubPlaces(resolved);

        if (resolved.length > 0 && map && typeof google !== 'undefined' && google.maps?.LatLngBounds) {
          const bounds = new google.maps.LatLngBounds();
          resolved.forEach((p) => bounds.extend(p.location));
          map.fitBounds(bounds, 56);
        }
      } catch (err) {
        if (!cancelled) {
          triggerQuotaIfNeeded(err);
          setStatusError('Could not load portfolio hub locations right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHubs(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placesLib, map, triggerQuotaIfNeeded]);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch modern Place Autocomplete (New) suggestions with session token bundling
  useEffect(() => {
    if (!placesLib) return;
    const trimmed = searchInput.trim();
    if (trimmed.length < 2) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      setStatusError(null);
      try {
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
        }
        const response = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: trimmed,
          sessionToken: sessionTokenRef.current,
        });
        if (!cancelled) {
          setSuggestions(response.suggestions ?? []);
          setDropdownOpen(true);
        }
      } catch (err) {
        if (!cancelled) {
          triggerQuotaIfNeeded(err);
          setSuggestions([]);
          setStatusError('Location autocomplete is temporarily unavailable.');
        }
      } finally {
        if (!cancelled) {
          setIsSearchingSuggestions(false);
        }
      }
    }, 240);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [placesLib, searchInput, triggerQuotaIfNeeded]);

  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;
      setIsResolvingSelection(true);
      setDropdownOpen(false);
      setStatusError(null);

      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport', 'googleMapsURI'],
        });

        // Reset session token after consuming it in fetchFields
        sessionTokenRef.current = null;
        setSuggestions([]);

        const location = toLatLngLiteral(place.location);
        if (!location) {
          setStatusError('The selected place did not return coordinates.');
          return;
        }

        const resolved: ResolvedPlace = {
          id: place.id || `search-${Date.now()}`,
          regionTag: 'Selected Location',
          displayName: place.displayName || suggestion.placePrediction.text.text,
          formattedAddress: place.formattedAddress || '',
          location,
          viewport: place.viewport ?? null,
          googleMapsURI: place.googleMapsURI ?? null,
        };

        setSearchPlace(resolved);
        setSelectedPlaceId(resolved.id);
        setActiveHubQueryId(null);
        setSearchInput(resolved.displayName);
        focusMapOnPlace(resolved);
      } catch (err) {
        triggerQuotaIfNeeded(err);
        setStatusError('Unable to fetch details for that location.');
      } finally {
        setIsResolvingSelection(false);
      }
    },
    [placesLib, focusMapOnPlace, triggerQuotaIfNeeded]
  );

  const handleHubButtonClick = useCallback(
    async (hub: PortfolioHubQuery) => {
      setStatusError(null);
      setActiveHubQueryId(hub.id);

      const existing = hubPlaces.find((p) => p.hubId === hub.id);
      if (existing) {
        setSelectedPlaceId(existing.id);
        focusMapOnPlace(existing);
        return;
      }

      if (!placesLib) return;
      setIsResolvingSelection(true);
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: hub.searchQuery,
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport', 'googleMapsURI'],
          maxResultCount: 1,
        });
        const match = places?.[0];
        const location = toLatLngLiteral(match?.location);
        if (!match || !location) {
          setStatusError(`No map results found for ${hub.label}.`);
          return;
        }

        const resolved: ResolvedPlace = {
          id: match.id || hub.id,
          hubId: hub.id,
          hubLabel: hub.label,
          regionTag: hub.regionTag,
          roleContext: hub.roleContext,
          displayName: match.displayName || hub.label,
          formattedAddress: match.formattedAddress || '',
          location,
          viewport: match.viewport ?? null,
          googleMapsURI: match.googleMapsURI ?? null,
        };

        setHubPlaces((prev) => [...prev.filter((p) => p.hubId !== hub.id), resolved]);
        setSelectedPlaceId(resolved.id);
        focusMapOnPlace(resolved);
      } catch (err) {
        triggerQuotaIfNeeded(err);
        setStatusError(`Unable to locate ${hub.label} right now.`);
      } finally {
        setIsResolvingSelection(false);
      }
    },
    [hubPlaces, placesLib, focusMapOnPlace, triggerQuotaIfNeeded]
  );

  const handleResetView = () => {
    setSelectedPlaceId(null);
    setActiveHubQueryId(null);
    setSearchPlace(null);
    setSearchInput('');
    setSuggestions([]);
    if (map && hubPlaces.length > 0 && typeof google !== 'undefined' && google.maps?.LatLngBounds) {
      const bounds = new google.maps.LatLngBounds();
      hubPlaces.forEach((p) => bounds.extend(p.location));
      map.fitBounds(bounds, 56);
    } else if (map) {
      map.setCenter(INITIAL_MAP_VIEW.center);
      map.setZoom(INITIAL_MAP_VIEW.zoom);
    }
  };

  const allMarkers = searchPlace
    ? [...hubPlaces.filter((p) => p.id !== searchPlace.id), searchPlace]
    : hubPlaces;

  const selectedPlace = allMarkers.find((p) => p.id === selectedPlaceId) ?? null;

  const hasAuthFailure =
    apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="space-y-5">
      {/* Controls Row: Hub Quick Select + Modern Place Autocomplete Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Portfolio work and education hubs">
          {PORTFOLIO_HUB_QUERIES.map((hub) => {
            const isActive = activeHubQueryId === hub.id || selectedPlace?.hubId === hub.id;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => void handleHubButtonClick(hub)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{hub.label}</span>
              </button>
            );
          })}

          {(selectedPlace || searchPlace) && (
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View all hubs</span>
            </button>
          )}
        </div>

        {/* Modern Place Autocomplete Search Input */}
        <div ref={searchBoxRef} className="relative w-full lg:w-80 shrink-0">
          <label htmlFor="portfolio-map-search" className="sr-only">
            Search cities or institutions on Google Maps
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="portfolio-map-search"
              type="text"
              value={searchInput}
              onChange={(e) => {
                const nextVal = e.target.value;
                setSearchInput(nextVal);
                if (nextVal.trim().length < 2) {
                  setSuggestions([]);
                  setIsSearchingSuggestions(false);
                  setDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) setDropdownOpen(true);
              }}
              placeholder="Search any city or place..."
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
            {(isSearchingSuggestions || isResolvingSelection) ? (
              <Loader2
                className="w-4 h-4 text-blue-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
            ) : searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSuggestions([]);
                  setDropdownOpen(false);
                }}
                aria-label="Clear location search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {dropdownOpen && suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label="Google Maps place suggestions"
              className="absolute z-30 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/10 py-1 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => {
                const prediction = suggestion.placePrediction;
                if (!prediction) return null;
                return (
                  <li key={prediction.placeId || index} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => void handleSelectSuggestion(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-700 flex items-start gap-2 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" aria-hidden="true" />
                      <span className="leading-snug">{prediction.text.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {statusError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs sm:text-sm text-amber-900"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>{statusError}</span>
        </div>
      )}

      {/* Explicit-Height Map Canvas Container */}
      <div
        data-testid="portfolio-google-map-container"
        className="relative h-[420px] sm:h-[460px] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
      >
        {hasAuthFailure ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <AlertCircle className="w-8 h-8 text-amber-600 mb-2" aria-hidden="true" />
            <p className="font-display text-base font-semibold text-slate-900">
              Google Maps could not initialize
            </p>
            <p className="mt-1 text-sm text-slate-600 max-w-md">
              The Maps JavaScript API failed to authenticate or reached its quota limit. Please check the project API key configuration.
            </p>
          </div>
        ) : (
          <GoogleMap
            mapId="DEMO_MAP_ID"
            defaultCenter={INITIAL_MAP_VIEW.center}
            defaultZoom={INITIAL_MAP_VIEW.zoom}
            gestureHandling="greedy"
            internalUsageAttributionIds={MAPS_ATTRIBUTION_IDS}
            className="w-full h-full"
          >
            {allMarkers.map((place) => (
              <HubMarkerWithInfo
                key={place.id}
                place={place}
                isSelected={selectedPlaceId === place.id}
                onSelect={() => {
                  setSelectedPlaceId(place.id);
                  if (place.hubId) setActiveHubQueryId(place.hubId);
                }}
                onClose={() => setSelectedPlaceId(null)}
              />
            ))}
          </GoogleMap>
        )}

        {isLoadingHubs && !hasAuthFailure && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 inline-flex items-center gap-2 shadow-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" aria-hidden="true" />
            <span>Loading portfolio hubs…</span>
          </div>
        )}
      </div>

      {/* Selected Hub Context Strip */}
      {selectedPlace && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-xs font-medium text-blue-600">
              {selectedPlace.regionTag || 'Google Maps Place'}
            </p>
            <p className="font-display text-sm sm:text-base font-bold text-slate-900">
              {selectedPlace.displayName}
            </p>
            {selectedPlace.formattedAddress && (
              <p className="text-xs text-slate-600">{selectedPlace.formattedAddress}</p>
            )}
            {selectedPlace.roleContext && (
              <p className="text-xs sm:text-sm text-slate-700 pt-1 leading-relaxed">
                {selectedPlace.roleContext}
              </p>
            )}
          </div>
          {selectedPlace.googleMapsURI && (
            <a
              href={selectedPlace.googleMapsURI}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              <span>View on Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {/* Terms Notice */}
      <p className="text-xs text-slate-500 leading-relaxed">
        Interactive map and live place search powered by Google Maps Platform. Use of Google Maps
        features is subject to the{' '}
        <a
          href={MAPS_END_USER_TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-700"
        >
          Google Maps End User Additional Terms of Service
        </a>{' '}
        and{' '}
        <a
          href={MAPS_PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-700"
        >
          Google Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

interface PortfolioLocationMapProps {
  apiKey: string;
}

export default function PortfolioLocationMap({ apiKey }: PortfolioLocationMapProps) {
  const resolvedKey = (apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '').trim();

  if (!resolvedKey) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Geographic Footprint &amp; Location Explorer
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              The interactive Google Map requires a provisioned Google Maps Platform API key in the
              runtime environment. Yoftahe Yoseph is based in Addis Ababa, Ethiopia and collaborates
              remotely with global engineering and healthcare research teams.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="geographic-footprint-heading"
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"
    >
      <div className="max-w-3xl mb-6">
        <p className="text-xs sm:text-sm font-medium text-blue-600">
          Geographic Footprint · Ethiopia &amp; Remote Global
        </p>
        <h2
          id="geographic-footprint-heading"
          className="mt-1 font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
        >
          Project &amp; Collaboration Hubs
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Explore the institutions and regional hubs connected to Yoftahe&apos;s engineering work—from
          Addis Ababa (Mesob Center) and Haramaya University to Hawassa and Leku—or search any
          location worldwide.
        </p>
      </div>

      <APIProvider apiKey={resolvedKey} language="en" region="ET">
        <MapExplorerWorkspace />
      </APIProvider>
    </section>
  );
}
