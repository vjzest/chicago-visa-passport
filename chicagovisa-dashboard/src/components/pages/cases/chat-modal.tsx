import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/services/axios/axios";
import { RefreshCcw, SendHorizontal } from "lucide-react";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IMGS } from "@/lib/constants";
import { toast } from "sonner";
// const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
// socket.on("connect", () => {
// });

type IMessage = {
  createdAt: string;
  senderType: "user" | "admin";
  text: string;
  case: string;
  admin?: {
    firstName: string;
    lastName: string;
    image: string;
  };
};

const ChatModal = ({
  open,
  setOpen,
  caseId,
  caseNo,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  caseId: string;
  caseNo: string;
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currMessage, setCurrMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/admin/cases/${caseId}/messages`
      );
      if (!data.success) throw new Error(data.message);
      setMessages(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `/admin/cases/${caseId}/send-message`,
        {
          message: currMessage,
        }
      );
      if (!data.success) throw new Error(data.message);
      setCurrMessage("");
      fetchMessages();
    } catch (error: any) {
      toast.error("Unable to send message", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (val) setOpen(true);
        else {
          setCurrMessage("");
          setOpen(false);
        }
      }}
    >
      <DialogContent>
        <DialogTitle>
          Chat with customer for case{" "}
          <span className="text-primary uppercase">{caseNo}</span>
        </DialogTitle>
        <div
          id="message-list"
          className="w-full md:min-w-[60vw] min-w-full md:min-h-[60vh] h-[60vh] bg-slate-100 rounded-lg p-4 flex flex-col overflow-y-auto gap-2"
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.senderType === "admin" ? "items-end" : "items-start"} w-full`}
              >
                {message.senderType === "user" ? (
                  <div
                    className={`max-w-[70%] flex flex-col p-2 rounded-lg bg-gray-200`}
                  >
                    {message.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[70%] flex gap-4 p-2 rounded-lg bg-blue-400 text-white`}
                  >
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-slate-200">
                        {message.admin?.firstName +
                          " " +
                          message.admin?.lastName}
                      </span>
                      <p className="max-w-[25rem] w-fit text-wrap break-all">
                        {message.text}
                      </p>
                    </div>
                    <Image
                      src={message.admin?.image || IMGS.UserPlaceHolder || ""}
                      alt="admin"
                      height={30}
                      width={30}
                      className="size-10 rounded-full"
                    />
                  </div>
                )}

                <span className="font-medium text-slate-400">
                  {new Date(message.createdAt).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "America/New_York",
                  }) +
                    " " +
                    new Date(message.createdAt).toLocaleTimeString("en-us", {
                      hour: "numeric",
                      minute: "numeric",
                      timeZone: "America/New_York",
                    })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-base text-slate-600 text-center my-auto">
              No messages yet
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          id="message-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className=""
        >
          <div
            className={`w-full flex items-center justify-start gap-1 underline py-1 px-4 cursor-pointer font-semibold1 ${loading ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => fetchMessages()}
          >
            Refresh <RefreshCcw size={15} />
          </div>

          <div className=" flex gap-2 w-full items-end">
            <textarea
              value={currMessage}
              onChange={(e) => setCurrMessage(e.target.value)}
              className={`w-full min-h-fit py-2 max-h-40 rounded-md px-8 border border-slate-500 resize-none overflow-hidden`}
              placeholder="Enter message"
              disabled={loading}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement; // Type assertion
                target.style.height = "auto"; // Reset the height to calculate scrollHeight
                target.style.height = `${160 > target.scrollHeight ? target.scrollHeight : 160}px`; // Adjust to fit content
                if (Number(target.style.height.slice(0, -2)) < 160)
                  target.style.overflowY = "hidden";
                else target.style.overflowY = "auto";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || (e.key === "Enter" && e.shiftKey)) {
                  e.preventDefault();
                  (
                    document.getElementById(
                      "submit-button"
                    ) as HTMLButtonElement
                  ).click();
                }
              }}
            />

            <Button
              id="submit-button"
              type="submit"
              disabled={!currMessage || loading}
            >
              <SendHorizontal />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
