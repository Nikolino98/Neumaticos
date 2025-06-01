
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminFilterOptions {
  search?: string;
  brand?: string;
  vehicleType?: string;
  priceRange?: string;
  status?: string;
}

interface AdminFilterProps {
  onFilterChange: (filters: AdminFilterOptions) => void;
}

const brandOptions = ['Michelin', 'Bridgestone', 'Pirelli', 'Continental', 'Goodyear', 'Firestone'];
const vehicleTypeOptions = ['auto', 'camioneta', 'camión', 'agro', 'otros'];
const priceRanges = [
  { label: 'Menos de $50,000', value: '0-50000' },
  { label: '$50,000 - $100,000', value: '50000-100000' },
  { label: '$100,000 - $200,000', value: '100000-200000' },
  { label: 'Más de $200,000', value: '200000-999999' }
];

export const AdminFilter: React.FC<AdminFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<AdminFilterOptions>({});
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof AdminFilterOptions, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value && value !== 'all') {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {isOpen && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select
                  value={filters.brand || 'all'}
                  onValueChange={(value) => updateFilter('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
                <Select
                  value={filters.vehicleType || 'all'}
                  onValueChange={(value) => updateFilter('vehicleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {vehicleTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label htmlFor="priceRange">Rango de Precio</Label>
                <Select
                  value={filters.priceRange || 'all'}
                  onValueChange={(value) => updateFilter('priceRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => updateFilter('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="promotion">En promoción</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="low-stock">Stock bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {Object.entries(filters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center space-x-1">
              <span>{key}: {value}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => updateFilter(key as keyof AdminFilterOptions, undefined)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
