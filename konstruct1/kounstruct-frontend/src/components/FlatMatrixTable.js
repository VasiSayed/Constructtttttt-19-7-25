import React, { useEffect, useRef, useState } from "react";
import { getLevelsWithFlatsByBuilding } from "../api";
import { useParams } from "react-router-dom";
import SiteBarHome from "./SiteBarHome";
import { useTheme } from "../ThemeContext";
import html2pdf from "html2pdf.js";

function FlatMatrixTable({ towerName = "A" }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { id } = useParams();
  const { theme } = useTheme();
  const pdfRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setApiError(null);
    (async () => {
      try {
        const res = await getLevelsWithFlatsByBuilding(id);
        setLevels(res.data || []);
      } catch (error) {
        setApiError("Failed to fetch levels/flats. Please try again.");
        setLevels([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const allFlats = levels.flatMap(l => l.flats || []);
    const typeCount = {};
    allFlats.forEach(flat => {
      const type = flat.flattype?.type_name || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return {
      totalFlats: allFlats.length,
      totalLevels: levels.length,
      typeBreakdown: typeCount,
      occupancyRate: Math.round((allFlats.filter(f => f.status === 'occupied').length / allFlats.length) * 100) || 0
    };
  }, [levels]);

  // Find max number of flats per floor (for column count)
  const maxFlats = Math.max(...levels.map(l => (l.flats || []).length), 0);

  // Unique room types for dropdown
  const roomTypes = Array.from(
    new Set(
      levels
        .flatMap(l => l.flats || [])
        .map(f => f.flattype?.type_name)
        .filter(Boolean)
    )
  ).sort();

  // Ordinal (1st, 2nd, ...)
  const getLevelOrdinal = (n) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  // Get flat status color
  const getFlatStatusColor = (flat) => {
    if (!flat) return '';
    switch (flat.status?.toLowerCase()) {
      case 'occupied': return 'bg-yellow-50 border-2 border-orange-500 text-orange-900';
      case 'available': return 'bg-orange-100 border-2 border-yellow-400 text-yellow-900';
      case 'maintenance': return 'bg-yellow-200 border-2 border-yellow-600 text-yellow-700';
      case 'reserved': return 'bg-orange-200 border-2 border-orange-700 text-orange-800';
      default: return 'bg-white border-2 border-orange-200 text-gray-900';
    }
  };

  // Orange/Yellow Theme
  const themeConfig = {
    dark: {
      pageBg: "bg-gradient-to-br from-[#281802] via-[#452709] to-[#2e1c00]",
      cardBg: "bg-[#392306]/80 border-[#a68c43]",
      textPrimary: "text-yellow-50",
      textSecondary: "text-orange-200",
      accent: "text-yellow-400",
    },
    light: {
      pageBg: "bg-gradient-to-br from-yellow-50 via-white to-orange-50",
      cardBg: "bg-white/90 border-orange-200",
      textPrimary: "text-orange-900",
      textSecondary: "text-yellow-700",
      accent: "text-orange-600",
    }
  };
  const currentTheme = themeConfig[theme] || themeConfig.light;

  // PDF download handler with loading state
  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const opt = {
        margin: 0.5,
        filename: `Tower_${towerName}_FlatMatrix_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: {
          unit: 'in',
          format: 'a3',
          orientation: maxFlats > 6 ? 'landscape' : 'portrait'
        }
      };
      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex ${currentTheme.pageBg} min-h-screen`}>
        <SiteBarHome />
        <div className="ml-[220px] p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className={`${currentTheme.textPrimary} text-base`}>Loading tower data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className={`flex ${currentTheme.pageBg} min-h-screen`}>
        <SiteBarHome />
        <div className="ml-[220px] p-8 flex items-center justify-center">
          <div className={`${currentTheme.cardBg} border rounded-lg p-8 text-center max-w-md`}>
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className={`${currentTheme.textPrimary} text-lg font-semibold mb-2`}>Error Loading Data</h3>
            <p className={currentTheme.textSecondary}>{apiError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!levels.length) {
    return (
      <div className={`flex ${currentTheme.pageBg} min-h-screen`}>
        <SiteBarHome />
        <div className="ml-[220px] p-8 flex items-center justify-center">
          <div className={`${currentTheme.cardBg} border rounded-lg p-8 text-center max-w-md`}>
            <div className="text-yellow-400 text-4xl mb-4">🏢</div>
            <h3 className={`${currentTheme.textPrimary} text-lg font-semibold mb-2`}>No Data Available</h3>
            <p className={currentTheme.textSecondary}>No floors or flats found for Tower {towerName}.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show floors top (1st) to bottom (highest)
  const reversedLevels = [...levels].reverse();
  // << MAKE BOXES VERY SMALL >>
  const gridTemplate = `minmax(24px,34px) repeat(${maxFlats}, minmax(44px,1fr))`;

  // Filter flats based on selected type
  const filteredStats = selectedType === "all" ? stats : {
    ...stats,
    totalFlats: stats.typeBreakdown[selectedType] || 0
  };

  return (
    <div className={`flex ${currentTheme.pageBg} min-h-screen`}>
      <SiteBarHome />
      <main className="flex-1 ml-[220px] py-3 px-2 w-full min-w-0">
        {/* Header Section */}
        <div className={`${currentTheme.cardBg} border rounded-xl p-4 mb-5 shadow-md`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${currentTheme.accent} mb-0.5`}>
                  Tower {towerName}
                </h1>
                <p className={`${currentTheme.textSecondary} text-xs`}>
                  Matrix • {stats.totalLevels} Floors • {stats.totalFlats} Units
                </p>
              </div>
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors border border-orange-300"
              >
                {showStats ? 'Hide' : 'Show'} Stats
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <label className={`${currentTheme.textSecondary} text-xs font-medium`}>
                  Filter:
                </label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="border border-orange-300 rounded-lg px-2 py-1 text-xs bg-orange-50 focus:ring-2 focus:ring-orange-400 focus:border-orange-500 min-w-[60px]"
                >
                  <option value="all">All ({stats.totalFlats})</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>
                      {type} ({stats.typeBreakdown[type] || 0})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPDF}
                className="px-3 py-1 rounded-lg text-white font-semibold shadow-md bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-xs"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    📄 Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {showStats && (
            <div className="mt-3 pt-2 border-t border-orange-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-orange-50 rounded-lg p-1 text-center">
                  <div className="text-base font-bold text-orange-700">{filteredStats.totalFlats}</div>
                  <div className="text-xs text-orange-800">Units</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-1 text-center">
                  <div className="text-base font-bold text-yellow-700">{stats.totalLevels}</div>
                  <div className="text-xs text-yellow-800">Floors</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-1 text-center">
                  <div className="text-base font-bold text-orange-500">{roomTypes.length}</div>
                  <div className="text-xs text-orange-600">Types</div>
                </div>
                <div className="bg-yellow-100 rounded-lg p-1 text-center">
                  <div className="text-base font-bold text-yellow-600">{maxFlats}</div>
                  <div className="text-xs text-yellow-700">Max/Flr</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className={`${currentTheme.cardBg} border border-orange-200 rounded-lg p-2 mb-3 shadow-sm`}>
          <h3 className={`${currentTheme.textPrimary} font-semibold mb-1 text-xs`}>Legend:</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-50 border-2 border-orange-500 rounded"></div>
              <span className="text-orange-700">Occupied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-100 border-2 border-yellow-400 rounded"></div>
              <span className="text-yellow-700">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-200 border-2 border-yellow-600 rounded"></div>
              <span className="text-yellow-800">Maintenance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-200 border-2 border-orange-700 rounded"></div>
              <span className="text-orange-800">Reserved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-white border-2 border-orange-200 rounded"></div>
              <span className="text-orange-600">Empty</span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className={`${currentTheme.cardBg} border border-orange-200 rounded-xl p-2 shadow-lg overflow-x-auto`}>
          <div
            ref={pdfRef}
            className="grid gap-1"
            style={{
              gridTemplateColumns: gridTemplate,
              minWidth: Math.max(40 + maxFlats * 46, 300),
            }}
          >
            {reversedLevels.map((level, rowIdx) => (
              <React.Fragment key={level.id}>

                {/* Floor Label */}
                <div
                  className="flex items-center justify-center rounded-xl font-bold text-orange-800 bg-gradient-to-br from-yellow-200 via-orange-100 to-yellow-100 shadow-sm border border-orange-400 text-xs relative overflow-hidden"
                  style={{ height: 36, minWidth: 34 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/40 to-orange-100/40"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-xs font-bold">{getLevelOrdinal(rowIdx + 1)}</div>
                    <div className="text-[9px] opacity-70">Floor</div>
                  </div>
                </div>

                {/* Flat Units */}
                {Array(maxFlats).fill(0).map((_, colIndex) => {
                  const flat = (level.flats || [])[colIndex];
                  const shouldShow = !flat || selectedType === "all" || flat.flattype?.type_name === selectedType;

                  if (flat && shouldShow) {
                    const statusColors = getFlatStatusColor(flat);
                    return (
                      <div
                        key={flat.id || colIndex}
                        className={`flex flex-col items-center justify-center shadow font-bold text-[10px] py-[2px] px-[1px] min-w-[44px] min-h-[36px] hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer relative group ${statusColors}`}
                        onClick={() => setSelectedFlat(selectedFlat === flat.id ? null : flat.id)}
                        style={{
                          borderRadius: "7px",
                          lineHeight: "12px"
                        }}
                      >
                        <div className="text-xs font-bold leading-[12px]">{flat.number}</div>
                        {flat.flattype?.type_name && (
                          <div className="text-[9px] font-medium opacity-80 text-center leading-tight">
                            {flat.flattype.type_name}
                          </div>
                        )}
                        {/* Show area only if <40px not, else can be added */}
                        {/* Status indicator & tooltip */}
                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-current opacity-70"></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0.5 px-1 py-0.5 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {flat.status || 'Unknown Status'} • Click
                        </div>
                      </div>
                    );
                  } else if (shouldShow) {
                    // Empty slot
                    return (
                      <div
                        key={colIndex}
                        className="bg-white border-2 border-orange-100 border-dashed rounded-lg flex items-center justify-center min-w-[44px] min-h-[36px] opacity-40"
                      >
                        <span className="text-orange-300 text-[8px]">—</span>
                      </div>
                    );
                  } else {
                    return <div key={colIndex} className="min-w-[44px] min-h-[36px]"></div>;
                  }
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Selected Flat Details Modal */}
        {selectedFlat && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2" onClick={() => setSelectedFlat(null)}>
            <div className={`${currentTheme.cardBg} border border-orange-300 rounded-xl p-4 max-w-xs w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
              {(() => {
                const flat = levels.flatMap(l => l.flats || []).find(f => f.id === selectedFlat);
                return flat ? (
                  <>
                    <h3 className={`${currentTheme.textPrimary} text-sm font-bold mb-2`}>Unit {flat.number}</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className={currentTheme.textSecondary}>Type:</span>
                        <span className={`${currentTheme.textPrimary} font-medium`}>{flat.flattype?.type_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={currentTheme.textSecondary}>Status:</span>
                        <span className={`font-medium ${flat.status === 'occupied' ? 'text-orange-700' : flat.status === 'available' ? 'text-yellow-700' : 'text-yellow-600'}`}>
                          {flat.status || 'Unknown'}
                        </span>
                      </div>
                      {flat.area && (
                        <div className="flex justify-between">
                          <span className={currentTheme.textSecondary}>Area:</span>
                          <span className={`${currentTheme.textPrimary} font-medium`}>{flat.area} sq ft</span>
                        </div>
                      )}
                      {flat.rent && (
                        <div className="flex justify-between">
                          <span className={currentTheme.textSecondary}>Rent:</span>
                          <span className={`${currentTheme.textPrimary} font-medium`}>₹{flat.rent}/month</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedFlat(null)}
                      className="mt-3 w-full px-3 py-1 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors text-xs text-orange-900"
                    >
                      Close
                    </button>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className={`${currentTheme.textSecondary} text-xs`}>
            Generated on {new Date().toLocaleDateString()} • Tower {towerName} Layout Matrix
          </p>
        </div>
      </main>
    </div>
  );
}

export default FlatMatrixTable;
