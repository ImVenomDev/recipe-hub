import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, reviewText: string) => void;
    initialRating?: number;
    initialReview?: string;
}

export default function RecipeRatingModal({
    isOpen,
    onClose,
    onSubmit,
    initialRating,
    initialReview
}: Props) {
    const [selected, setSelected] = useState<number>(initialRating ?? 0);
    const [reviewText, setReviewText] = useState<string>(initialReview ?? "");

    // Resetta valori quando si apre
    useEffect(() => {
        if (isOpen) {
            setSelected(initialRating ?? 0);
            setReviewText(initialReview ?? "");
        }
    }, [isOpen, initialRating, initialReview]);

    const handleSubmit = () => {
        if (selected > 0) {
            onSubmit(selected, reviewText.trim());
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>Valuta questa ricetta</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-4">
                    <p className="text-center text-gray-600 text-sm">
                        Seleziona il numero di stelle e scrivi un commento per aiutare altri utenti a scegliere meglio.
                    </p>
                    <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={36}
                                className={`cursor-pointer transition-transform transform hover:scale-110 ${
                                    star <= selected ? "text-yellow-400" : "text-gray-300"
                                }`}
                                onClick={() => setSelected(star)}
                                fill={star <= selected ? "#facc15" : "none"}
                            />
                        ))}
                    </div>
                    <textarea
                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                        placeholder="Scrivi qui la tua recensione (opzionale)"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="default" onPress={onClose}>
                        Annulla
                    </Button>
                    <Button color="primary" onPress={handleSubmit} isDisabled={selected === 0}>
                        Invia
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
