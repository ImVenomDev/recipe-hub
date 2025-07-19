import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import type { Recipe } from "../../types"; // importa correttamente il tipo se separato

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onSave: (updated: Recipe) => void;
}

export default function RecipeEditModal({ isOpen, onClose, recipe, onSave }: Props) {
  const [formData, setFormData] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    }
  }, [recipe]);

  const handleChange = (key: keyof Recipe, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    if (formData) onSave(formData);
    onClose();
  };

  if (!formData) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4 shadow-lg">
              <DialogTitle className="text-lg font-bold text-purple-800">Modifica Ricetta</DialogTitle>

              <Input
                label="Titolo"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                label="Categoria"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
              <Input
                label="Tempo di preparazione"
                value={formData.preparationTime}
                onChange={(e) => handleChange("preparationTime", e.target.value)}
              />
              <Input
                label="Immagine URL"
                value={formData.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
              />
              <Input
                label="Numero ingredienti"
                type="number"
                value={formData.ingredients.toString()}
                onChange={(e) => handleChange("ingredients", parseInt(e.target.value))}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="light" onPress={onClose}>Annulla</Button>
                <Button className="bg-green-600 text-white" onPress={handleSave}>Salva</Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
