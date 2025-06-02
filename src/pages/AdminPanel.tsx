import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, LogOut, Upload, Eye, Home, ShoppingCart, Tags } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminFilter } from '@/components/AdminFilter';
import { SEOHead } from '@/components/SEOHead';

interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  width: string;
  profile: string;
  diameter: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_promotion?: boolean;
  vehicle_type: string;
  stock_quantity?: number;
}

const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    size: '',
    width: '',
    profile: '',
    diameter: '',
    price: '',
    original_price: '',
    promotion_price: '',
    vehicle_type: 'auto',
    stock_quantity: '0',
    is_promotion: false
  });

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setLoading(false);
      return;
    }

    setUser(session.user);

    // Verificar si es admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    setIsAdmin(!!adminData);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Error de acceso",
        description: error.message,
        variant: "destructive"
      });
    } else {
      await checkAuth();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
    setFilteredProducts(data || []);
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.size.toLowerCase().includes(searchTerm)
      );
    }

    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Apply vehicle type filter
    if (filters.vehicleType) {
      filtered = filtered.filter(product => product.vehicle_type === filters.vehicleType);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Apply status filter
    if (filters.status) {
      switch (filters.status) {
        case 'promotion':
          filtered = filtered.filter(product => product.is_promotion);
          break;
        case 'regular':
          filtered = filtered.filter(product => !product.is_promotion);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => (product.stock_quantity || 0) < 10);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = editingProduct?.image_url || null;

    // Subir nueva imagen si se seleccionó
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "No se pudo subir la imagen",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }
    }

    // Determinar el precio final basado en si está en promoción
    const finalPrice = formData.is_promotion && formData.promotion_price 
      ? parseFloat(formData.promotion_price)
      : parseFloat(formData.price);

    const originalPrice = formData.is_promotion && formData.promotion_price 
      ? parseFloat(formData.price)
      : (formData.original_price ? parseFloat(formData.original_price) : null);

    const productData = {
      name: formData.name,
      brand: formData.brand,
      size: formData.vehicle_type === 'otros' ? (formData.size || 'N/A') : formData.size,
      width: formData.vehicle_type === 'otros' ? (formData.width || 'N/A') : formData.width,
      profile: formData.vehicle_type === 'otros' ? (formData.profile || 'N/A') : formData.profile,
      diameter: formData.vehicle_type === 'otros' ? (formData.diameter || 'N/A') : formData.diameter,
      price: finalPrice,
      original_price: originalPrice,
      vehicle_type: formData.vehicle_type,
      stock_quantity: parseInt(formData.stock_quantity),
      is_promotion: formData.is_promotion,
      image_url: imageUrl
    };

    let error;
    if (editingProduct) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Éxito",
        description: editingProduct ? "Producto actualizado" : "Producto creado"
      });
      
      resetForm();
      setIsDialogOpen(false);
      fetchProducts();
    }

    setUploading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Producto eliminado"
      });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      size: '',
      width: '',
      profile: '',
      diameter: '',
      price: '',
      original_price: '',
      promotion_price: '',
      vehicle_type: 'auto',
      stock_quantity: '0',
      is_promotion: false
    });
    setEditingProduct(null);
    setImageFile(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    const regularPrice = product.is_promotion && product.original_price 
      ? product.original_price.toString()
      : product.price.toString();
    
    const promotionPrice = product.is_promotion && product.original_price 
      ? product.price.toString()
      : '';

    setFormData({
      name: product.name,
      brand: product.brand,
      size: product.size,
      width: product.width,
      profile: product.profile,
      diameter: product.diameter,
      price: regularPrice,
      original_price: '',
      promotion_price: promotionPrice,
      vehicle_type: product.vehicle_type,
      stock_quantity: product.stock_quantity?.toString() || '0',
      is_promotion: product.is_promotion || false
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <>
        <SEOHead 
          title="Panel de Administración - Ruedas al Instante | Gestión de Neumáticos"
          description="Panel de administración para gestionar el catálogo de neumáticos y llantas online. Control de inventario, precios y promociones."
          canonical="https://ruedas-al-instante.com/admin"
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SEOHead 
          title="Acceso Administrativo - Ruedas al Instante | Login Panel Admin"
          description="Acceso al panel de administración de Ruedas al Instante para gestión de inventario de neumáticos y llantas."
          canonical="https://ruedas-al-instante.com/admin"
        />
        <LoginForm onSignIn={signIn} />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <SEOHead 
          title="Acceso Denegado - Panel Admin Ruedas al Instante"
          description="Acceso restringido al panel de administración. Solo usuarios autorizados pueden gestionar el catálogo de neumáticos."
          canonical="https://ruedas-al-instante.com/admin"
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Acceso Denegado</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>No tienes permisos de administrador.</p>
              <Button onClick={signOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Panel de Administración - Ruedas al Instante | Gestión Completa de Neumáticos"
        description="Panel administrativo completo para gestionar neumáticos online: inventario, precios, promociones, marcas como Michelin, Bridgestone, Pirelli. Control total del catálogo."
        keywords="panel admin neumáticos, gestión inventario llantas, administración tienda online, control precios neumáticos, gestión promociones ruedas"
        canonical="https://ruedas-al-instante.com/admin"
      />
      
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración - Ruedas al Instante</h1>
                <p className="text-sm text-gray-600 mt-1">Gestión completa de neumáticos y llantas online</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Hola, {user.email}</span>
                <Button onClick={() => window.open('/', '_blank')} variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Tienda
                </Button>
                <Button onClick={signOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Links */}
        <nav className="bg-blue-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-6">
              <a 
                href="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                title="Ir a la tienda online de neumáticos"
              >
                <Home className="h-4 w-4 mr-1" />
                Tienda Principal
              </a>
              <a 
                href="/#productos" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                title="Ver catálogo completo de neumáticos"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Catálogo de Productos
              </a>
              <a 
                href="/#promociones" 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                title="Ofertas especiales en neumáticos"
              >
                <Tags className="h-4 w-4 mr-1" />
                Promociones Activas
              </a>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Main Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Inventario de Neumáticos</h2>
            <p className="text-gray-600 mb-4">
              Administra el catálogo completo de neumáticos para autos, camionetas, camiones y vehículos agrícolas. 
              Controla precios, promociones y stock de todas las marcas premium.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Productos</h3>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-600">En Promoción</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.is_promotion).length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-600">Stock Bajo</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {products.filter(p => (p.stock_quantity || 0) < 10).length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-600">Filtrados</h3>
                  <p className="text-2xl font-bold text-green-600">{filteredProducts.length}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Actions and Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div>
              <h3 className="text-lg font-semibold">Control de Productos</h3>
              <p className="text-gray-600">Gestiona neumáticos de marcas como Michelin, Bridgestone, Pirelli y Continental</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="transition-transform duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Producto</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Tipo de Vehículo</Label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(value) => setFormData({...formData, vehicle_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="camioneta">Camioneta</SelectItem>
                        <SelectItem value="camión">Camión</SelectItem>
                        <SelectItem value="agro">Agro</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.vehicle_type !== 'otros' && (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Ancho</Label>
                          <Input
                            id="width"
                            value={formData.width}
                            onChange={(e) => setFormData({...formData, width: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="profile">Perfil</Label>
                          <Input
                            id="profile"
                            value={formData.profile}
                            onChange={(e) => setFormData({...formData, profile: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="diameter">Diámetro</Label>
                          <Input
                            id="diameter"
                            value={formData.diameter}
                            onChange={(e) => setFormData({...formData, diameter: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="size">Medida Completa</Label>
                          <Input
                            id="size"
                            value={formData.size}
                            onChange={(e) => setFormData({...formData, size: e.target.value})}
                            placeholder="195/65R15"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {formData.vehicle_type === 'otros' && (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Ancho (opcional)</Label>
                        <Input
                          id="width"
                          value={formData.width}
                          onChange={(e) => setFormData({...formData, width: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profile">Perfil (opcional)</Label>
                        <Input
                          id="profile"
                          value={formData.profile}
                          onChange={(e) => setFormData({...formData, profile: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="diameter">Diámetro (opcional)</Label>
                        <Input
                          id="diameter"
                          value={formData.diameter}
                          onChange={(e) => setFormData({...formData, diameter: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="size">Medida Completa (opcional)</Label>
                        <Input
                          id="size"
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                          placeholder="Especificación del producto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pricing Section */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_promotion"
                        checked={formData.is_promotion}
                        onCheckedChange={(checked) => setFormData({...formData, is_promotion: !!checked})}
                      />
                      <Label htmlFor="is_promotion" className="text-sm font-medium">
                        Producto en promoción
                      </Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio Regular</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          required
                        />
                      </div>
                      
                      {formData.is_promotion && (
                        <div className="space-y-2">
                          <Label htmlFor="promotion_price" className="text-red-600">Precio de Promoción</Label>
                          <Input
                            id="promotion_price"
                            type="number"
                            value={formData.promotion_price}
                            onChange={(e) => setFormData({...formData, promotion_price: e.target.value})}
                            className="border-red-300 focus:border-red-500"
                            placeholder="Precio con descuento"
                            required={formData.is_promotion}
                          />
                        </div>
                      )}
                    </div>

                    {formData.is_promotion && formData.price && formData.promotion_price && (
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                        <p><strong>Descuento:</strong> {Math.round(((parseFloat(formData.price) - parseFloat(formData.promotion_price)) / parseFloat(formData.price)) * 100)}%</p>
                        <p><strong>Ahorro:</strong> ${(parseFloat(formData.price) - parseFloat(formData.promotion_price)).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Imagen del Producto</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {editingProduct?.image_url && (
                      <div className="text-sm text-gray-600">
                        Imagen actual: {editingProduct.image_url.split('/').pop()}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          {editingProduct ? 'Actualizando...' : 'Creando...'}
                        </>
                      ) : (
                        editingProduct ? 'Actualizar' : 'Crear'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter Section */}
          <section className="mb-6">
            <h4 className="text-md font-medium mb-3">Filtros de Búsqueda</h4>
            <AdminFilter onFilterChange={handleFilterChange} />
          </section>

          {/* Products Section */}
          <section>
            <h4 className="text-md font-medium mb-4">Catálogo de Neumáticos Disponibles</h4>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex space-x-1">
                          {product.is_promotion && (
                            <Badge className="bg-red-500">Promo</Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <p className="text-sm">{product.size}</p>
                      <p className="text-sm text-gray-600">{product.vehicle_type}</p>
                      
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-blue-600">${product.price.toLocaleString()}</p>
                        {product.original_price && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.original_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(product)}
                          className="transition-transform duration-300 hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h5 className="text-lg font-medium text-gray-700 mb-2">No se encontraron productos</h5>
                <p className="text-gray-600">No hay neumáticos que coincidan con los filtros aplicados.</p>
                <div className="mt-4 space-x-4">
                  <a 
                    href="/#productos" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Ver catálogo público
                  </a>
                  <a 
                    href="/#promociones" 
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Ver promociones activas
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* Footer Links */}
          <footer className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h6 className="font-medium mb-3">Enlaces Importantes</h6>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-blue-600 hover:text-blue-800">Inicio - Ruedas al Instante</a></li>
                  <li><a href="/#productos" className="text-blue-600 hover:text-blue-800">Catálogo de Neumáticos</a></li>
                  <li><a href="/#promociones" className="text-blue-600 hover:text-blue-800">Ofertas Especiales</a></li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-3">Categorías de Productos</h6>
                <ul className="space-y-2 text-sm">
                  <li><a href="/#busqueda" className="text-blue-600 hover:text-blue-800">Neumáticos para Auto</a></li>
                  <li><a href="/#busqueda" className="text-blue-600 hover:text-blue-800">Neumáticos para Camioneta</a></li>
                  <li><a href="/#busqueda" className="text-blue-600 hover:text-blue-800">Neumáticos para Camión</a></li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-3">Gestión Administrativa</h6>
                <p className="text-sm text-gray-600">
                  Panel completo para administrar el inventario de neumáticos online de Ruedas al Instante.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

const LoginForm: React.FC<{ onSignIn: (email: string, password: string) => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
