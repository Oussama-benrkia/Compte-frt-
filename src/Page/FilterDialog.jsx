import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FilterDialog({ isOpen, onClose, onSubmit }) {
  const [filterType, setFilterType] = useState('type')
  const [type, setType] = useState('TOUS')
  const [solde, setSolde] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const criteria = {
      type,
      ...(filterType === 'typeAndSolde' && solde !== '' && { solde: parseFloat(solde) })
    }
    onSubmit(criteria)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrer les comptes</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Choisir le type de filtre</Label>
              <RadioGroup value={filterType} onValueChange={(value) => setFilterType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="type" id="type" />
                  <Label htmlFor="type">Par type seulement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="typeAndSolde" id="typeAndSolde" />
                  <Label htmlFor="typeAndSolde">Par type et solde</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type de compte</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous</SelectItem>
                  <SelectItem value="EPARGNE">EPARGNE</SelectItem>
                  <SelectItem value="COURANT">COURANT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filterType === 'typeAndSolde' && (
              <div className="grid gap-2">
                <Label htmlFor="solde">Solde minimum</Label>
                <Input
                  id="solde"
                  type="number"
                  value={solde}
                  onChange={(e) => setSolde(e.target.value)}
                  placeholder="Entrez le solde minimum"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Appliquer le filtre</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
