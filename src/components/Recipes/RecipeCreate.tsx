import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase.config";
import RecipeForm from "./RecipeForm";

type RecipeCreateProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function RecipeCreate({ isOpen, onOpenChange }: RecipeCreateProps) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => doc.data().title);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (recipe: any, onClose: () => void) => {
    try {
      await addDoc(collection(db, "recipes"), recipe);
      addToast({
        title: "Ricetta creata!",
        description: "La tua ricetta è stata salvata con successo.",
        color:"success",
        timeout: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      addToast({
        title: "Errore",
        description: "Qualcosa è andato storto. Riprova.",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  return (
    <Modal scrollBehavior="outside" isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <RecipeForm categories={categories} onSubmit={(data) => handleSubmit(data, onClose)} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Chiudi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
