'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_COMPTES, DELETE_COMPTE, SAVE_COMPTE, GET_TOTAL_SOLDE, GET_ALL_COMPTES_AND_TOTAL_SOLDE } from '@/Services/CompteGraph';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Filter, CreditCard, Calendar, Euro } from 'lucide-react';
import AddAccountPopup from './AddAccountPopup';
import FilterDialog from './FilterDialog';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ComptehomesPage() {
  const [comptes, setComptes] = useState([]);
  const [solde, setsolde] = useState({});

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [compteToDelete, setCompteToDelete] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    type: 'TOUS',
    solde: '',
    filterBySolde: false
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_COMPTES_AND_TOTAL_SOLDE);
  const [deleteCompte] = useMutation(DELETE_COMPTE, {
    update(cache, { data: { deleteCompte } }) {
      if (deleteCompte) {
        refetch();
        //refetch_solde();
      }
    },
    onError: (err) => {
      console.error('Delete error:', err);
      alert("Une erreur est survenue lors de la suppression du compte.");
    }
  });

  const [addaccount] = useMutation(SAVE_COMPTE, {
    update({ data: { saveCompte } }) {
      if (saveCompte) {
        refetch();
       // refetch_solde();
      }
    },
    onError: (err) => {
      console.error('Add error:', err);
      alert("Une erreur est survenue lors de l'ajout du compte.");
    }
  });

  useEffect(() => {
    if (data?.allComptes) {
      setComptes(data.allComptes);
      setsolde(data.totalSolde)
    }
  }, [data]);

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Erreur : {error.message}</div>;

  const handleDelete = async (id) => {
    setCompteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompte({ variables: { id: compteToDelete } });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete operation failed:', error);
      alert("La suppression a échoué. Veuillez réessayer.");
    }
  };

  const handleAdd = async (newCompte) => {
    await addaccount({
      variables: newCompte,
    });
    setIsAddPopupOpen(false);
    refetch();
  };

  const handleFilterSubmit = (options) => {
    setFilterOptions(options);
    if (options.type !== "TOUS") {
      if (options.solde) {
        refetch({ type: options.type, minSolde: options.solde });
      } else {
        refetch({ type: options.type });
      }
    }
    setIsFilterDialogOpen(false);
  };

  const filteredComptes = comptes.filter(compte =>
    (filterOptions.type === 'TOUS' || compte.type === filterOptions.type) &&
    (!filterOptions.filterBySolde || compte.solde >= parseFloat(filterOptions.solde || '0'))
  );



  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Liste des Comptes</h1>

      <div className="mb-6 flex justify-between items-center">
        <Button onClick={() => setIsFilterDialogOpen(true)} variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
        <Button onClick={() => setIsAddPopupOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un compte
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComptes.map((compte) => (
            <Card key={compte.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center">
                  <span>Compte {compte.id}</span>
                  <CreditCard className="h-6 w-6" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center mb-2">
                  <Euro className="mr-2 h-4 w-4" />
                  <p className="font-semibold">{compte.solde.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="flex items-center mb-2">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <p>{compte.type}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <p>{new Date(compte.dateCreation).toLocaleDateString('fr-FR')}</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end bg-muted/50">
                <Button variant="destructive" onClick={() => handleDelete(compte.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <AddAccountPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onAdd={handleAdd}
      />
      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 shadow-md border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="font-semibold">Total : <span className="text-primary">{solde.sum} €</span></p>
            <p className="text-sm text-muted-foreground">Moyenne : {solde.average} €</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Nombre de comptes : <span className="text-primary">{solde.count}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

