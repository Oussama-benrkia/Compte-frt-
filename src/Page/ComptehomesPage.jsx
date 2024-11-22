'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, AlertCircle, Filter } from 'lucide-react'
import AddAccountPopup from './AddAccountPopup'
import FilterDialog from './FilterDialog.jsx'

export default function ComptehomesPage() {
  const [comptes, setComptes] = useState([
    {
      id: "9",
      solde: 8200,
      type: "EPARGNE",
      dateCreation: "2023-10-05"
    },
    {
      id: "10",
      solde: 9100,
      type: "COURANT",
      dateCreation: "2023-11-30"
    }
  ])
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    type: 'TOUS',
    solde: '',
    filterBySolde: false
  })

  const handleDelete = (id) => {
    setComptes(comptes.filter(compte => compte.id !== id))
  }

  const handleAdd = (newCompte) => {
    setComptes([...comptes, newCompte])
    setIsAddPopupOpen(false)
  }

  const handleFilterSubmit = (options) => {
    setFilterOptions(options)
    setIsFilterDialogOpen(false)
  }

  const filteredComptes = comptes.filter(compte => 
    (filterOptions.type === 'TOUS' || compte.type === filterOptions.type) &&
    (!filterOptions.filterBySolde || compte.solde >= parseFloat(filterOptions.solde || '0'))
  )

  const showAlert = () => {
    alert('Hello!')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Comptes</h1>
      
      <div className="mb-4">
        <Button onClick={() => setIsFilterDialogOpen(true)}>
          <Filter className="mr-2 h-4 w-4" /> Filtrer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComptes.map((compte) => (
          <Card key={compte.id}>
            <CardHeader>
              <CardTitle>Compte {compte.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Solde: {compte.solde} €</p>
              <p>Type: {compte.type}</p>
              <p>Date de création: {compte.dateCreation}</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="destructive" onClick={() => handleDelete(compte.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-4 right-4">
        <Button onClick={() => setIsAddPopupOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un compte
        </Button>
      </div>

      <div className="fixed bottom-4 left-4">
        <Button onClick={showAlert}>
          <AlertCircle className="mr-2 h-4 w-4" /> Afficher Alerte
        </Button>
      </div>

      <AddAccountPopup isOpen={isAddPopupOpen} onClose={() => setIsAddPopupOpen(false)} onAdd={handleAdd} />
      <FilterDialog 
        isOpen={isFilterDialogOpen} 
        onClose={() => setIsFilterDialogOpen(false)} 
        onSubmit={handleFilterSubmit}
        initialOptions={filterOptions}
      />
    </div>
  )
}
