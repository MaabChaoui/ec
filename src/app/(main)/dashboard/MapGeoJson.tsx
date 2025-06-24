// import type { FeatureCollection, Point, Polygon, Feature } from 'geojson';
// import type { LatLngExpression } from 'leaflet';
// import L from 'leaflet';
// import { MapContainer, Marker, Popup, GeoJSON, TileLayer } from 'react-leaflet';
// import { useState, useMemo } from 'react';

// // Updated interface to match your actual data structure
// interface PlantProperties {
//   id: string;
//   scientific_name: string;
//   common_names: {
//     en: string;
//     fr: string;
//     ar: string;
//   };
//   family: string;
//   collection_type: 'individual' | 'group';
//   planted_year: string;
//   height_range: string;
//   _tempLayerId?: number;
// }

// // Type for features that can be either Point or Polygon
// type PlantFeature = Feature<Point | Polygon, PlantProperties>;
// type PlantFeatureCollection = FeatureCollection<
//   Point | Polygon,
//   PlantProperties
// >;

// interface MapsGeoJSONProps {
//   geoJsonData: PlantFeatureCollection;
//   // Future filter props
//   filterByFamily?: string;
//   filterByCollectionType?: 'individual' | 'group';
//   filterByYearRange?: [number, number];
//   filterByHeightRange?: string;
// }

// const MapsGeoJSON: React.FC<MapsGeoJSONProps> = ({
//   geoJsonData,
//   filterByFamily,
//   filterByCollectionType,
//   filterByYearRange,
//   filterByHeightRange,
// }) => {
//   const [selectedFeature, setSelectedFeature] = useState<PlantFeature | null>(
//     null
//   );
//   const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain' | 'dark' | 'light' | 'outdoors' | 'streets' | 'toner' | 'watercolor'>('light');

//   // Enhanced custom icons for different plant types
//   const createCustomIcon = (family: string, collectionType: string) => {
//     const color = getColorByFamily(family);
//     const iconSize = collectionType === 'group' ? [32, 32] : [24, 24];
    
//     return L.divIcon({
//       html: `
//         <div style="
//           background: linear-gradient(135deg, ${color}, ${color}dd);
//           width: ${iconSize[0]}px;
//           height: ${iconSize[1]}px;
//           border-radius: 50%;
//           border: 3px solid white;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 12px;
//           color: white;
//           font-weight: bold;
//         ">
//           ${collectionType === 'group' ? '🌿' : '🌱'}
//         </div>
//       `,
//       className: 'custom-plant-marker',
//       iconSize: iconSize,
//       iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
//     });
//   };

//   // Filter features based on provided filters
//   const filteredFeatures = useMemo(() => {
//     if (!geoJsonData?.features) return [];

//     return geoJsonData.features.filter((feature) => {
//       const props = feature.properties;

//       // Apply filters
//       if (filterByFamily && props.family !== filterByFamily) return false;
//       if (
//         filterByCollectionType &&
//         props.collection_type !== filterByCollectionType
//       )
//         return false;

//       if (filterByYearRange) {
//         const plantedYear = parseInt(props.planted_year);
//         if (
//           plantedYear < filterByYearRange[0] ||
//           plantedYear > filterByYearRange[1]
//         )
//           return false;
//       }

//       if (filterByHeightRange && props.height_range !== filterByHeightRange)
//         return false;

//       return true;
//     });
//   }, [
//     geoJsonData,
//     filterByFamily,
//     filterByCollectionType,
//     filterByYearRange,
//     filterByHeightRange,
//   ]);

//   // Calculate map center from all features
//   const mapCenter: LatLngExpression = useMemo(() => {
//     if (!filteredFeatures.length) return [36.7472, 3.0736]; // Default center for Algiers

//     const bounds = filteredFeatures.reduce(
//       (acc, feature) => {
//         if (feature.geometry.type === 'Point') {
//           const [lng, lat] = feature.geometry.coordinates;
//           acc.lats.push(lat);
//           acc.lngs.push(lng);
//         } else if (feature.geometry.type === 'Polygon') {
//           feature.geometry.coordinates[0].forEach(([lng, lat]) => {
//             acc.lats.push(lat);
//             acc.lngs.push(lng);
//           });
//         }
//         return acc;
//       },
//       { lats: [] as number[], lngs: [] as number[] }
//     );

//     const centerLat =
//       bounds.lats.reduce((a, b) => a + b, 0) / bounds.lats.length;
//     const centerLng =
//       bounds.lngs.reduce((a, b) => a + b, 0) / bounds.lngs.length;

//     return [centerLat, centerLng];
//   }, [filteredFeatures]);

//   // Enhanced style function for GeoJSON polygons
//   const geoJsonStyle = (
//     feature?: Feature<Point | Polygon, PlantProperties>
//   ) => {
//     if (!feature || feature.geometry.type !== 'Polygon') return {};

//     const baseColor = getColorByFamily(feature.properties.family);
//     return {
//       fillColor: baseColor,
//       weight: 2,
//       opacity: 1,
//       color: '#ffffff',
//       dashArray: '',
//       fillOpacity: 0.7,
//       className: 'polygon-area',
//     };
//   };

//   // Enhanced color mapping for different plant families
//   const getColorByFamily = (family: string): string => {
//     const colors: { [key: string]: string } = {
//       adw: '#10b981', // Emerald
//       bamboo: '#22c55e', // Green
//       palm: '#3b82f6', // Blue
//       rose: '#f43f5e', // Rose
//       oak: '#92400e', // Brown
//       pine: '#059669', // Teal
//       maple: '#dc2626', // Red
//       default: '#6b7280', // Gray
//     };
//     return colors[family.toLowerCase()] || colors.default;
//   };

//   // Get family statistics
//   const familyStats = useMemo(() => {
//     const stats: { [key: string]: number } = {};
//     filteredFeatures.forEach((feature) => {
//       const family = feature.properties.family;
//       stats[family] = (stats[family] || 0) + 1;
//     });
//     return Object.entries(stats)
//       .sort(([, a], [, b]) => b - a)
//       .slice(0, 5);
//   }, [filteredFeatures]);

//   // Enhanced popup content
//   const createPopupContent = (props: PlantProperties) => `
//     <div style="
//       min-width: 280px;
//       font-family: system-ui, -apple-system, sans-serif;
//       line-height: 1.5;
//     ">
//       <div style="
//         background: linear-gradient(135deg, ${getColorByFamily(props.family)}, ${getColorByFamily(props.family)}dd);
//         color: white;
//         padding: 12px;
//         margin: -12px -12px 12px -12px;
//         border-radius: 8px 8px 0 0;
//       ">
//         <h3 style="margin: 0; font-size: 16px; font-weight: 600; margin-bottom: 4px;">
//           ${props.scientific_name}
//         </h3>
//         <span style="
//           background: rgba(255,255,255,0.2);
//           padding: 2px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           text-transform: uppercase;
//           font-weight: 500;
//         ">${props.family}</span>
//       </div>
      
//       <div style="padding: 0 4px;">
//         <div style="margin-bottom: 16px;">
//           <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">
//             Common Names
//           </h4>
//           <div style="display: grid; gap: 4px; font-size: 13px;">
//             <div style="display: flex; justify-content: space-between;">
//               <span style="color: #6b7280; font-weight: 500;">English:</span>
//               <span style="color: #111827;">${props.common_names.en}</span>
//             </div>
//             <div style="display: flex; justify-content: space-between;">
//               <span style="color: #6b7280; font-weight: 500;">French:</span>
//               <span style="color: #111827;">${props.common_names.fr}</span>
//             </div>
//             <div style="display: flex; justify-content: space-between;">
//               <span style="color: #6b7280; font-weight: 500;">Arabic:</span>
//               <span style="color: #111827;">${props.common_names.ar}</span>
//             </div>
//           </div>
//         </div>
        
//         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
//           <div>
//             <span style="color: #6b7280; font-weight: 500;">Type:</span><br>
//             <span style="color: #111827; text-transform: capitalize;">${props.collection_type}</span>
//           </div>
//           <div>
//             <span style="color: #6b7280; font-weight: 500;">Planted:</span><br>
//             <span style="color: #111827;">${props.planted_year}</span>
//           </div>
//         </div>
        
//         <div style="margin-top: 12px; font-size: 13px;">
//           <span style="color: #6b7280; font-weight: 500;">Height Range:</span><br>
//           <span style="color: #111827;">${props.height_range}</span>
//         </div>
//       </div>
//     </div>
//   `;

//   // Handle feature events
//   const onEachFeature = (feature: PlantFeature, layer: L.Layer) => {
//     const props = feature.properties;
//     layer.bindPopup(createPopupContent(props), {
//       maxWidth: 320,
//       className: 'custom-popup'
//     });

//     layer.on({
//       click: () => setSelectedFeature(feature),
//       mouseover: (e) => {
//         const layer = e.target;
//         if (feature.geometry.type === 'Polygon') {
//           layer.setStyle({
//             weight: 3,
//             fillOpacity: 0.9,
//             color: '#ffffff',
//           });
//         }
//       },
//       mouseout: (e) => {
//         const layer = e.target;
//         if (feature.geometry.type === 'Polygon') {
//           layer.setStyle(geoJsonStyle(feature));
//         }
//       },
//     });
//   };

//   // Render point markers separately for better control
//   const renderPointMarkers = () => {
//     return filteredFeatures
//       .filter((feature) => feature.geometry.type === 'Point')
//       .map((feature, index) => {
//         const [lng, lat] = (feature.geometry as Point).coordinates;
//         const props = feature.properties;

//         return (
//           <Marker
//             key={`${props.id}-${index}`}
//             position={[lat, lng]}
//             icon={createCustomIcon(props.family, props.collection_type)}
//             eventHandlers={{
//               click: () => setSelectedFeature(feature),
//             }}
//           >
//             <Popup className="custom-popup">
//               <div dangerouslySetInnerHTML={{ __html: createPopupContent(props) }} />
//             </Popup>
//           </Marker>
//         );
//       });
//   };

//   // Create GeoJSON data with only polygons for the GeoJSON component
//   const polygonData: PlantFeatureCollection = {
//     type: 'FeatureCollection',
//     features: filteredFeatures.filter(
//       (feature) => feature.geometry.type === 'Polygon'
//     ),
//   };

//   // Get tile layer configuration based on map style
//   const getTileLayerConfig = () => {
//     switch (mapStyle) {
//       case 'dark':
//         return {
//           url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           subdomains: 'abcd'
//         };
//       case 'light':
//         return {
//           url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           subdomains: 'abcd'
//         };
//       case 'outdoors':
//         return {
//           url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
//           attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           subdomains: 'abc'
//         };
//       case 'streets':
//         return {
//           url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
//           subdomains: 'abcd'
//         };
//       case 'toner':
//         return {
//           url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
//           attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           subdomains: 'abcd'
//         };
//       case 'watercolor':
//         return {
//           url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
//           attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           subdomains: 'abcd'
//         };
//       case 'satellite':
//         return {
//           url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//           attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
//         };
//       case 'terrain':
//         return {
//           url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
//           attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
//           subdomains: 'abc'
//         };
//       default: // 'default'
//         return {
//           url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           subdomains: 'abc'
//         };
//     }
//   };

//   if (!geoJsonData?.features?.length) {
//     return (
//       <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
//         <div className="text-center">
//           <div className="text-4xl mb-4">🗺️</div>
//           <p className="text-gray-600 font-medium">No GeoJSON data provided</p>
//           <p className="text-gray-400 text-sm mt-2">Upload plant location data to see the map</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full space-y-6">
//       {/* Header with statistics and controls */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
//           <h2 className="text-xl font-bold text-white mb-2">Plant Distribution Map</h2>
//           <p className="text-green-100 text-sm">
//             Interactive map showing {filteredFeatures.length} of {geoJsonData.features.length} plant features
//           </p>
//         </div>
        
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Statistics Cards */}
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-blue-600 text-sm font-medium">Total Features</p>
//                   <p className="text-2xl font-bold text-blue-900">{filteredFeatures.length}</p>
//                 </div>
//                 <div className="text-blue-500 text-2xl">📍</div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-green-600 text-sm font-medium">Plant Families</p>
//                   <p className="text-2xl font-bold text-green-900">{familyStats.length}</p>
//                 </div>
//                 <div className="text-green-500 text-2xl">🌿</div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-purple-600 text-sm font-medium">Individual Plants</p>
//                   <p className="text-2xl font-bold text-purple-900">
//                     {filteredFeatures.filter(f => f.properties.collection_type === 'individual').length}
//                   </p>
//                 </div>
//                 <div className="text-purple-500 text-2xl">🌱</div>
//               </div>
//             </div>
            
//             <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-orange-600 text-sm font-medium">Plant Groups</p>
//                   <p className="text-2xl font-bold text-orange-900">
//                     {filteredFeatures.filter(f => f.properties.collection_type === 'group').length}
//                   </p>
//                 </div>
//                 <div className="text-orange-500 text-2xl">🌳</div>
//               </div>
//             </div>
//           </div>
          
//           {/* Top Families */}
//           {familyStats.length > 0 && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Plant Families</h3>
//               <div className="flex flex-wrap gap-2">
//                 {familyStats.map(([family, count]) => (
//                   <span
//                     key={family}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
//                     style={{
//                       backgroundColor: `${getColorByFamily(family)}20`,
//                       color: getColorByFamily(family),
//                       border: `1px solid ${getColorByFamily(family)}40`
//                     }}
//                   >
//                     <span 
//                       className="w-2 h-2 rounded-full mr-2"
//                       style={{ backgroundColor: getColorByFamily(family) }}
//                     ></span>
//                     {family} ({count})
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Map Container */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="p-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Interactive Map View</h3>
//             <div className="flex items-center space-x-3">
//               <label className="text-sm font-medium text-gray-700">Map Style:</label>
//               <select
//                 value={mapStyle}
//                 onChange={(e) => setMapStyle(e.target.value as any)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm min-w-[140px]"
//               >
//                 <optgroup label="Professional">
//                   <option value="light">Light (Elegant)</option>
//                   <option value="dark">Dark (Modern)</option>
//                   <option value="streets">Streets (Clean)</option>
//                 </optgroup>
//                 <optgroup label="Specialized">
//                   <option value="outdoors">Outdoors (Nature)</option>
//                   <option value="satellite">Satellite (Imagery)</option>
//                   <option value="terrain">Terrain (Topographic)</option>
//                 </optgroup>
//                 <optgroup label="Artistic">
//                   <option value="toner">Toner (High Contrast)</option>
//                   <option value="watercolor">Watercolor (Artistic)</option>
//                 </optgroup>
//                 <optgroup label="Standard">
//                   <option value="default">Default (OpenStreetMap)</option>
//                 </optgroup>
//               </select>
//             </div>
//           </div>
//         </div>
        
//         <div className="relative">
//           <MapContainer
//             className="h-[600px] w-full"
//             zoom={16}
//             scrollWheelZoom={true}
//             center={mapCenter}
//           >
//             {(() => {
//               const config = getTileLayerConfig();
//               return (
//                 <TileLayer
//                   url={config.url}
//                   attribution={config.attribution}
//                   subdomains={config.subdomains}
//                   maxZoom={18}
//                 />
//               );
//             })()}

//             {/* Render polygon features */}
//             {polygonData.features.length > 0 && (
//               <GeoJSON
//                 data={polygonData}
//                 style={geoJsonStyle}
//                 onEachFeature={onEachFeature}
//               />
//             )}

//             {/* Render point markers */}
//             {renderPointMarkers()}
//           </MapContainer>
          
//           {/* Enhanced Legend with Style Preview */}
//           <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs">
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="font-semibold text-gray-900 text-sm">Legend</h4>
//               <div className="flex items-center space-x-1">
//                 <div 
//                   className="w-2 h-2 rounded-full"
//                   style={{ backgroundColor: mapStyle === 'dark' ? '#ffffff' : '#10b981' }}
//                 ></div>
//                 <span className="text-xs text-gray-500 capitalize">{mapStyle}</span>
//               </div>
//             </div>
//             <div className="space-y-2 text-xs">
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-sm"></div>
//                 <span className="text-gray-700">🌱 Individual Plant</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-sm"></div>
//                 <span className="text-gray-700">🌿 Plant Group</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded opacity-70 shadow-sm"></div>
//                 <span className="text-gray-700">Collection Area</span>
//               </div>
//               <div className="mt-3 pt-2 border-t border-gray-200">
//                 <div className="text-xs text-gray-500">
//                   Zoom: Interactive • Click: Details
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Map Style Preview Badge */}
//           <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm">
//             🗺️ {mapStyle.charAt(0).toUpperCase() + mapStyle.slice(1)} Style
//           </div>
//         </div>
//       </div>

//       {/* Selected Feature Details */}
//       {selectedFeature && (
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div 
//             className="px-6 py-4 text-white"
//             style={{ 
//               background: `linear-gradient(135deg, ${getColorByFamily(selectedFeature.properties.family)}, ${getColorByFamily(selectedFeature.properties.family)}dd)` 
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-xl font-bold">{selectedFeature.properties.scientific_name}</h3>
//                 <p className="text-white/90 text-sm">Selected Feature Details</p>
//               </div>
//               <button
//                 onClick={() => setSelectedFeature(null)}
//                 className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Common Names</h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">English:</span>
//                       <span className="font-medium">{selectedFeature.properties.common_names.en}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">French:</span>
//                       <span className="font-medium">{selectedFeature.properties.common_names.fr}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Arabic:</span>
//                       <span className="font-medium">{selectedFeature.properties.common_names.ar}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Classification</h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Family:</span>
//                       <span 
//                         className="font-medium px-2 py-1 rounded text-xs"
//                         style={{ 
//                           backgroundColor: `${getColorByFamily(selectedFeature.properties.family)}20`,
//                           color: getColorByFamily(selectedFeature.properties.family)
//                         }}
//                       >
//                         {selectedFeature.properties.family}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Type:</span>
//                       <span className="font-medium capitalize">{selectedFeature.properties.collection_type}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Geometry:</span>
//                       <span className="font-medium">{selectedFeature.geometry.type}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-2">Growth Info</h4>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Planted Year:</span>
//                       <span className="font-medium">{selectedFeature.properties.planted_year}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Height Range:</span>
//                       <span className="font-medium">{selectedFeature.properties.height_range}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Custom Styles */}
//       <style jsx global>{`
//         .custom-popup .leaflet-popup-content-wrapper {
//           border-radius: 12px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
//           border: 1px solid rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//         }
        
//         .custom-popup .leaflet-popup-tip {
//           background: white;
//           border: 1px solid rgba(0, 0, 0, 0.1);
//         }
        
//         .custom-plant-marker {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
//         }
        
//         .custom-plant-marker:hover {
//           transform: scale(1.15) translateY(-2px);
//           filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
//         }
        
//         .polygon-area {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
//         }
        
//         .polygon-area:hover {
//           filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
//         }
        
//         .leaflet-container {
//           font-family: system-ui, -apple-system, sans-serif;
//           background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
//         }
        
//         /* Enhanced tile layer transitions */
//         .leaflet-tile-container {
//           transition: opacity 0.3s ease-in-out;
//         }
        
//         /* Custom control styling */
//         .leaflet-control-zoom a {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(0, 0, 0, 0.1);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           transition: all 0.2s ease;
//         }
        
//         .leaflet-control-zoom a:hover {
//           background: rgba(255, 255, 255, 1);
//           transform: scale(1.05);
//         }
        
//         /* Attribution styling */
//         .leaflet-control-attribution {
//           background: rgba(255, 255, 255, 0.8);
//           backdrop-filter: blur(5px);
//           border-radius: 6px;
//           margin: 8px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//         }
        
//         /* Map container enhancements */
//         .leaflet-container {
//           border-radius: 0.75rem;
//           overflow: hidden;
//         }
        
//         /* Loading state enhancement */
//         .leaflet-tile {
//           transition: opacity 0.2s ease-in-out;
//         }
        
//         /* Custom marker cluster styling if needed */
//         .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
//           background: linear-gradient(135deg, #10b981, #059669);
//           border: 3px solid rgba(255, 255, 255, 0.9);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//           backdrop-filter: blur(5px);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MapsGeoJSON;

import type { FeatureCollection, Point, Polygon, Feature } from 'geojson';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { MapContainer, Marker, Popup, GeoJSON, TileLayer } from 'react-leaflet';
import { useState, useMemo } from 'react';

// Updated interface to match your simplified data structure
interface PlantProperties {
  id: string;
  scientific_name: string;
  _tempLayerId?: number;
  fill?: string;
  fill_opacity?: number;
  stroke?: string;
  stroke_width?: number;
}

// Type for features that can be either Point or Polygon
type PlantFeature = Feature<Point | Polygon, PlantProperties>;
type PlantFeatureCollection = FeatureCollection<
  Point | Polygon,
  PlantProperties
>;

interface MapsGeoJSONProps {
  geoJsonData: PlantFeatureCollection;
}

const MapsGeoJSON: React.FC<MapsGeoJSONProps> = ({ geoJsonData }) => {
  const [selectedFeature, setSelectedFeature] = useState<PlantFeature | null>(
    null
  );
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain' | 'dark' | 'light' | 'outdoors' | 'streets' | 'toner' | 'watercolor'>('light');

  // Enhanced custom icons for different plant types
  const createCustomIcon = (scientificName: string) => {
    const color = getColorBySpecies(scientificName);
    const iconSize = [28, 28];
    
    return L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, ${color}, ${color}dd);
          width: ${iconSize[0]}px;
          height: ${iconSize[1]}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
        ">
          🌿
        </div>
      `,
      className: 'custom-plant-marker',
      iconSize: iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
    });
  };

  // All features (no filtering needed)
  const features = useMemo(() => {
    return geoJsonData?.features || [];
  }, [geoJsonData]);

  // Calculate map center from all features
  const mapCenter: LatLngExpression = useMemo(() => {
    if (!features.length) return [36.7472, 3.0736]; // Default center for Algiers

    const bounds = features.reduce(
      (acc, feature) => {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          acc.lats.push(lat);
          acc.lngs.push(lng);
        } else if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach(([lng, lat]) => {
            acc.lats.push(lat);
            acc.lngs.push(lng);
          });
        }
        return acc;
      },
      { lats: [] as number[], lngs: [] as number[] }
    );

    const centerLat =
      bounds.lats.reduce((a, b) => a + b, 0) / bounds.lats.length;
    const centerLng =
      bounds.lngs.reduce((a, b) => a + b, 0) / bounds.lngs.length;

    return [centerLat, centerLng];
  }, [features]);

  // Enhanced style function for GeoJSON polygons
  const geoJsonStyle = (
    feature?: Feature<Point | Polygon, PlantProperties>
  ) => {
    if (!feature || feature.geometry.type !== 'Polygon') return {};

    const props = feature.properties;
    
    // Use the fill color from properties if available, otherwise use species-based color
    const fillColor = props.fill ? props.fill.replace(/`/g, '') : getColorBySpecies(props.scientific_name);
    const strokeColor = props.stroke ? props.stroke.replace(/`/g, '') : '#ffffff';
    const fillOpacity = props.fill_opacity ?? 0.7;
    const strokeWidth = props.stroke_width ?? 2;

    return {
      fillColor: fillColor,
      weight: strokeWidth,
      opacity: 1,
      color: strokeColor,
      dashArray: '',
      fillOpacity: fillOpacity,
      className: 'polygon-area',
    };
  };

  // Color mapping for different plant species
  const getColorBySpecies = (scientificName: string): string => {
    const colors: { [key: string]: string } = {
      bamboo: '#22c55e', // Green
      ficus: '#3b82f6', // Blue
      palm: '#f59e0b', // Orange
      rose: '#f43f5e', // Rose
      oak: '#92400e', // Brown
      pine: '#059669', // Teal
      maple: '#dc2626', // Red
      default: '#6b7280', // Gray
    };
    return colors[scientificName.toLowerCase()] || colors.default;
  };

  // Get species statistics
  const speciesStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    features.forEach((feature) => {
      const species = feature.properties.scientific_name;
      stats[species] = (stats[species] || 0) + 1;
    });
    return Object.entries(stats).sort(([, a], [, b]) => b - a);
  }, [features]);

  // Enhanced popup content
  const createPopupContent = (props: PlantProperties) => `
    <div style="
      min-width: 260px;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    ">
      <div style="
        background: linear-gradient(135deg, ${getColorBySpecies(props.scientific_name)}, ${getColorBySpecies(props.scientific_name)}dd);
        color: white;
        padding: 12px;
        margin: -12px -12px 12px -12px;
        border-radius: 8px 8px 0 0;
      ">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; margin-bottom: 4px; text-transform: capitalize;">
          ${props.scientific_name}
        </h3>
        <span style="
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 500;
        ">ID: ${props.id}</span>
      </div>
      
      <div style="padding: 0 4px;">
        <div style="display: grid; gap: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280; font-weight: 500;">Scientific Name:</span>
            <span style="color: #111827; text-transform: capitalize;">${props.scientific_name}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280; font-weight: 500;">Feature ID:</span>
            <span style="color: #111827;">${props.id}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle feature events
  const onEachFeature = (feature: PlantFeature, layer: L.Layer) => {
    const props = feature.properties;
    layer.bindPopup(createPopupContent(props), {
      maxWidth: 300,
      className: 'custom-popup'
    });

    layer.on({
      click: () => setSelectedFeature(feature),
      mouseover: (e) => {
        const layer = e.target;
        if (feature.geometry.type === 'Polygon') {
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.9,
            color: '#ffffff',
          });
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        if (feature.geometry.type === 'Polygon') {
          layer.setStyle(geoJsonStyle(feature));
        }
      },
    });
  };

  // Render point markers separately for better control
  const renderPointMarkers = () => {
    return features
      .filter((feature) => feature.geometry.type === 'Point')
      .map((feature, index) => {
        const [lng, lat] = (feature.geometry as Point).coordinates;
        const props = feature.properties;

        return (
          <Marker
            key={`${props.id}-${index}`}
            position={[lat, lng]}
            icon={createCustomIcon(props.scientific_name)}
            eventHandlers={{
              click: () => setSelectedFeature(feature),
            }}
          >
            <Popup className="custom-popup">
              <div dangerouslySetInnerHTML={{ __html: createPopupContent(props) }} />
            </Popup>
          </Marker>
        );
      });
  };

  // Create GeoJSON data with only polygons for the GeoJSON component
  const polygonData: PlantFeatureCollection = {
    type: 'FeatureCollection',
    features: features.filter(
      (feature) => feature.geometry.type === 'Polygon'
    ),
  };

  // Get tile layer configuration based on map style
  const getTileLayerConfig = () => {
    switch (mapStyle) {
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd'
        };
      case 'light':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd'
        };
      case 'outdoors':
        return {
          url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
          attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc'
        };
      case 'streets':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd'
        };
      case 'toner':
        return {
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd'
        };
      case 'watercolor':
        return {
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd'
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        };
      case 'terrain':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          subdomains: 'abc'
        };
      default: // 'default'
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abc'
        };
    }
  };

  if (!geoJsonData?.features?.length) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-gray-600 font-medium">No GeoJSON data provided</p>
          <p className="text-gray-400 text-sm mt-2">Upload plant location data to see the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white mb-2">Plant Distribution Map</h2>
          <p className="text-green-100 text-sm">
            Interactive map showing {features.length} plant features
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statistics Cards */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Features</p>
                  <p className="text-2xl font-bold text-blue-900">{features.length}</p>
                </div>
                <div className="text-blue-500 text-2xl">📍</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Plant Species</p>
                  <p className="text-2xl font-bold text-green-900">{speciesStats.length}</p>
                </div>
                <div className="text-green-500 text-2xl">🌿</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Point Features</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {features.filter(f => f.geometry.type === 'Point').length}
                  </p>
                </div>
                <div className="text-purple-500 text-2xl">🌱</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Polygon Areas</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {features.filter(f => f.geometry.type === 'Polygon').length}
                  </p>
                </div>
                <div className="text-orange-500 text-2xl">🌳</div>
              </div>
            </div>
          </div>
          
          {/* Species List */}
          {speciesStats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Plant Species</h3>
              <div className="flex flex-wrap gap-2">
                {speciesStats.map(([species, count]) => (
                  <span
                    key={species}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${getColorBySpecies(species)}20`,
                      color: getColorBySpecies(species),
                      border: `1px solid ${getColorBySpecies(species)}40`
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getColorBySpecies(species) }}
                    ></span>
                    {species} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Map View</h3>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Map Style:</label>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm min-w-[140px]"
              >
                <optgroup label="Professional">
                  <option value="light">Light (Elegant)</option>
                  <option value="dark">Dark (Modern)</option>
                  <option value="streets">Streets (Clean)</option>
                </optgroup>
                <optgroup label="Specialized">
                  <option value="outdoors">Outdoors (Nature)</option>
                  <option value="satellite">Satellite (Imagery)</option>
                  <option value="terrain">Terrain (Topographic)</option>
                </optgroup>
                <optgroup label="Artistic">
                  <option value="toner">Toner (High Contrast)</option>
                  <option value="watercolor">Watercolor (Artistic)</option>
                </optgroup>
                <optgroup label="Standard">
                  <option value="default">Default (OpenStreetMap)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <MapContainer
            className="h-[600px] w-full"
            zoom={16}
            scrollWheelZoom={true}
            center={mapCenter}
          >
            {(() => {
              const config = getTileLayerConfig();
              return (
                <TileLayer
                  url={config.url}
                  attribution={config.attribution}
                  subdomains={config.subdomains}
                  maxZoom={18}
                />
              );
            })()}

            {/* Render polygon features */}
            {polygonData.features.length > 0 && (
              <GeoJSON
                data={polygonData}
                style={geoJsonStyle}
                onEachFeature={onEachFeature}
              />
            )}

            {/* Render point markers */}
            {renderPointMarkers()}
          </MapContainer>
          
          {/* Enhanced Legend */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-sm">Legend</h4>
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: mapStyle === 'dark' ? '#ffffff' : '#10b981' }}
                ></div>
                <span className="text-xs text-gray-500 capitalize">{mapStyle}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-sm flex items-center justify-center text-xs">🌿</div>
                <span className="text-gray-700">Plant Feature</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded opacity-70 shadow-sm"></div>
                <span className="text-gray-700">Plant Area</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Zoom: Interactive • Click: Details
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Style Preview Badge */}
          <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm">
            🗺️ {mapStyle.charAt(0).toUpperCase() + mapStyle.slice(1)} Style
          </div>
        </div>
      </div>

      {/* Selected Feature Details */}
      {selectedFeature && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div 
            className="px-6 py-4 text-white"
            style={{ 
              background: `linear-gradient(135deg, ${getColorBySpecies(selectedFeature.properties.scientific_name)}, ${getColorBySpecies(selectedFeature.properties.scientific_name)}dd)` 
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold capitalize">{selectedFeature.properties.scientific_name}</h3>
                <p className="text-white/90 text-sm">Selected Feature Details</p>
              </div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{selectedFeature.properties.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scientific Name:</span>
                      <span className="font-medium capitalize">{selectedFeature.properties.scientific_name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Geometry</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedFeature.geometry.type}</span>
                    </div>
                    {selectedFeature.properties.fill && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fill Color:</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: selectedFeature.properties.fill.replace(/`/g, '') }}
                          ></div>
                          <span className="font-medium text-xs">{selectedFeature.properties.fill.replace(/`/g, '')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Style Properties</h4>
                  <div className="space-y-2 text-sm">
                    {selectedFeature.properties.fill_opacity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fill Opacity:</span>
                        <span className="font-medium">{selectedFeature.properties.fill_opacity}</span>
                      </div>
                    )}
                    {selectedFeature.properties.stroke_width && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stroke Width:</span>
                        <span className="font-medium">{selectedFeature.properties.stroke_width}px</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .custom-plant-marker {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
        }
        
        .custom-plant-marker:hover {
          transform: scale(1.15) translateY(-2px);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
        }
        
        .polygon-area {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .polygon-area:hover {
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }
        
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 0.75rem;
          overflow: hidden;
        }
        
           .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
        
        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(5px);
          border-radius: 6px;
          margin: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Map container enhancements */
        .leaflet-container {
          border-radius: 0.75rem;
          overflow: hidden;
        }
        
        /* Loading state enhancement */
        .leaflet-tile {
          transition: opacity 0.2s ease-in-out;
        }
        
        /* Custom marker cluster styling if needed */
        .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
          background: linear-gradient(135deg, #10b981, #059669);
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
};

export default MapsGeoJSON;