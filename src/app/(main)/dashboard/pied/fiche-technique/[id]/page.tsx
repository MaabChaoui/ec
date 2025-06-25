"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download,
  MapPin,
  Calendar,
  Leaf,
  Droplets,
  Sun,
  Scissors,
  Bug,
  TreePine
} from 'lucide-react';

// Pied type
interface Pied {
  id: number;
  genre_id: number;
  nom_commun: string;
  nom_scientifique_ancien?: string;
  nom_scientifique_nouveau?: string;
  famille?: string;
  origine?: string;
  type?: string;
  age?: string;
  exigences?: string;
  taux_croissance?: string;
  periode_floraison?: string;
  periode_fruitification?: string;
  multiplication?: string;
  maladie_id?: number;
  élagage?: string;
  utilisation?: string;
  caracteristique_feuillage?: string;
  cycle_vegetatif?: string;
}

export default function FicheTechniquePage() {
  const params = useParams();
  const router = useRouter();
  const piedId = params.id as string;
  
  const [pied, setPied] = useState<Pied | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pied data
  useEffect(() => {
    const fetchPied = async () => {
      if (!piedId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/pieds/detail/${piedId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pied details');
        }
        const data = await response.json();
        setPied(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPied();
  }, [piedId]);

  const handleDelete = async () => {
    if (!pied || !confirm('Êtes-vous sûr de vouloir supprimer cette fiche?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/pieds/${pied.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        router.back();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting pied:', err);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Exporting PDF for pied:', pied?.id);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !pied) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          Erreur: {error || 'Pied non trouvé'}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toString().toLowerCase()) {
      case 'young': case 'jeune': return 'bg-green-100 text-green-800';
      case 'mature': return 'bg-blue-100 text-blue-800';
      case 'old': case 'ancien': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Fiche Technique</h1>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Plant Image & Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              {/* Plant Image Placeholder */}
              <div className="relative mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <TreePine className="h-20 w-20 text-green-600" />
                </div>
                <Badge className="absolute top-2 right-2 bg-white text-gray-700">
                  ID: {String(pied.id).padStart(5, '0')}
                </Badge>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {pied.nom_commun}
                  </h3>
                  <p className="text-sm text-gray-600 italic">
                    {pied.nom_scientifique_nouveau || pied.nom_scientifique_ancien || 'Non spécifié'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Famille:</span>
                    <span className="text-sm text-gray-900">{pied.famille || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Origine:</span>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {pied.origine || 'Non spécifié'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <Badge variant="secondary" className="text-xs">
                      {pied.type || 'Non spécifié'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Âge:</span>
                    <Badge className={`text-xs ${getStatusColor(pied.age || '')}`}>
                      {pied.age || 'Non spécifié'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Characteristics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Caractéristique du feuillage</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {pied.caracteristique_feuillage || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Cycle végétatif</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {pied.cycle_vegetatif || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Taux de croissance</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-gray-500" />
                    {pied.taux_croissance || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Utilisation</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {pied.utilisation || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cultivation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                Culture & Entretien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Exigences
                  </label>
                  <p className="text-sm bg-blue-50 p-3 rounded-md border-l-4 border-blue-200">
                    {pied.exigences || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-orange-500" />
                    Élagage
                  </label>
                  <p className="text-sm bg-orange-50 p-3 rounded-md border-l-4 border-orange-200">
                    {pied.élagage || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Multiplication</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {pied.multiplication || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phenology Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Phénologie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Période de floraison</label>
                  <p className="text-sm bg-purple-50 p-3 rounded-md border-l-4 border-purple-200">
                    {pied.periode_floraison || 'Non spécifié'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Période de fructification</label>
                  <p className="text-sm bg-green-50 p-3 rounded-md border-l-4 border-green-200">
                    {pied.periode_fruitification || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Section */}
          {pied.maladie_id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-red-600" />
                  Santé & Maladies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-200">
                  <p className="text-sm text-red-800">
                    Maladie référencée (ID: {pied.maladie_id})
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Consultez la section Maladies pour plus de détails
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
        </div>
      </div>
    </div>
  );
}