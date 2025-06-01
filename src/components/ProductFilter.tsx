import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface FilterOptions {
  search?: string;
  width?: string;
  profile?: string;
  diameter?: string;
  brand?: string;
  vehicleType?: string;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [uniqueValues, setUniqueValues] = useState({
    widths: [] as string[],
    profiles: [] as string[],
    diameters: [] as string[],
    brands: [] as string[],
    vehicleTypes: [] as string[]
  });

  useEffect(() => {
    fetchUniqueValues();
  }, []);

  const fetchUniqueValues = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('width, profile, diameter, brand, vehicle_type');

      if (products) {
        const widths = [...new Set(products.map(p => p.width))].sort();
        const profiles = [...new Set(products.map(p => p.profile))].sort();
        const diameters = [...new Set(products.map(p => p.diameter))].sort();
        const brands = [...new Set(products.map(p => p.brand))].sort();
        const vehicleTypes = [...new Set(products.map(p => p.vehicle_type))].sort();

        setUniqueValues({ widths, profiles, diameters, brands, vehicleTypes });
      }
    } catch (error) {
      console.error('Error fetching unique values:', error);
    }
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters };
    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Filter Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Encuentra tu Neumático Ideal</h2>
            <p className="text-blue-100">Usa nuestros filtros avanzados para encontrar el neumático perfecto</p>
          </div>
          
          <Button
            onClick={onToggle}
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            {isOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{activeFiltersCount}</Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative max-w-md mx-auto md:mx-0 ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
          <Input
            type="text"
            placeholder="Buscar por marca, medida..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white focus:text-gray-900"
          />
        </div>
      </div>

      {/* Collapsible Advanced Filters */}
      {isOpen && (
        <Card className="animate-fade-in shadow-lg border-0 bg-blue-200 ">
          <CardHeader className="bg-gray-50 rounded-t-lg bg-blue-200">
            <div className="flex items-center justify-between ">
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-600 text-center"/>
                Filtros Avanzados
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar ({activeFiltersCount})
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Width Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Ancho</Label>
                <Select value={filters.width || 'all'} onValueChange={(value) => updateFilter('width', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Ancho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.widths.map((width) => (
                      <SelectItem key={width} value={width}>
                        {width}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Perfil</Label>
                <Select value={filters.profile || 'all'} onValueChange={(value) => updateFilter('profile', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.profiles.map((profile) => (
                      <SelectItem key={profile} value={profile}>
                        {profile}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Diameter Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Diámetro</Label>
                <Select value={filters.diameter || 'all'} onValueChange={(value) => updateFilter('diameter', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Diámetro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.diameters.map((diameter) => (
                      <SelectItem key={diameter} value={diameter}>
                        {diameter}"
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Marca</Label>
                <Select value={filters.brand || 'all'} onValueChange={(value) => updateFilter('brand', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueValues.brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Vehículo</Label>
                <Select value={filters.vehicleType || 'all'} onValueChange={(value) => updateFilter('vehicleType', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Filtros activos:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="flex items-center space-x-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <span className="capitalize">{key}: {value}</span>
                      <X
                        className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => updateFilter(key as keyof FilterOptions, '')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};