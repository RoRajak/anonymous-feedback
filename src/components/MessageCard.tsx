import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import type { Message } from "@/models/User";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const handleDeleteConfirm = async () => {
      try {
        const response = await axios.delete<ApiResponse>(
          `/api/delete-message/${message._id}`
        );
        toast({
          title: response.data.message,
        });
        onMessageDelete(message._id as string);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessages = axiosError.response?.data.message;
        toast({
          title: "Error deleting message",
          description: errorMessages,
        });
      }
    };
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger>
            <X className="size-5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default MessageCard;
