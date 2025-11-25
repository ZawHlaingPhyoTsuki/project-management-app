import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CardHeader from "./CardHeader";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import CardDescription from "./CardDescription";
import CardActivity from "./CardActivity";
import CardActions from "./CardActions";
import { User } from "@/interfaces";
import { addCardMember } from "@/services/card";

interface CardModel {
  id: string;
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
}

const CardModal = ({ id, isModal, setIsModal }: CardModel) => {
  const { data: cardDetails, isLoading: cardLoading } = useSWR(
    isModal ? `/api/card/${id}` : null,
    fetcher
  );
  const { data: auditDetails, isLoading: auditLoading } = useSWR(
    isModal ? `/api/card/${id}/cardlogs` : null,
    fetcher
  );
  const [cardData, setCardData] = useState(cardDetails);

  useEffect(() => {
    if (cardDetails) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCardData(cardDetails);
    }
  }, [cardDetails]);

  const removeCardMember = async (user: User) => {
    if (!cardData) return;

    const updatedCardData = { ...cardData };
    const updatedUsers =
      updatedCardData.users?.filter((u: User) => u.id !== user.id) || [];

    setCardData({
      ...updatedCardData,
      users: updatedUsers,
    });

    try {
      await addCardMember({ user, card: updatedCardData });
    } catch (error) {
      console.error("Failed to remove card member:", error);
      // Revert on error
      setCardData(cardData);
    }
  };

  // Show loading state
  if (cardLoading) {
    return (
      <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
        <DialogContent>
          <div className="p-4">Loading card details...</div>
        </DialogContent>
      </Dialog>
    );
  }

  // Don't render content until cardData is available
  if (!cardData) {
    return (
      <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
        <DialogContent>
          <div className="p-4">Card not found</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isModal} onOpenChange={() => setIsModal(false)}>
      <DialogContent>
        <CardHeader cardData={cardData} setCardData={setCardData} />
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="flex gap-3 mb-4">
              {cardData?.users?.map((user: User) => (
                <div
                  key={user.id}
                  className="relative group cursor-pointer"
                  onClick={() => removeCardMember(user)}
                >
                  <img
                    src={user?.image}
                    className="h-7 w-7 rounded-full"
                    alt={user.name}
                  />
                  <div className="absolute -right-1 -top-1 bg-red-500 h-4 w-4 flex items-center justify-center text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </div>
                </div>
              ))}
            </div>
            <div>
              <CardDescription cardData={cardData} setCardData={setCardData} />
              <CardActivity
                auditDetails={auditDetails}
                // isLoading={auditLoading}
              />
            </div>
          </div>
          <CardActions cardData={cardData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
