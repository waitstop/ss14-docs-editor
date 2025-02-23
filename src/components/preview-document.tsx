import { type FormEvent, useState } from "react";
import type { Database } from "@/database";
import parseBBCode from "@/lib/parseBB";
import dayjs from "dayjs";
import { generateBBCode } from "@/lib/generateBB";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  document: Database["public"]["Tables"]["documents"]["Row"];
};

export default function PreviewDocument({ document }: Props) {
  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    date: `00:00:00 ${dayjs().add(1000, "years").format("DD.MM.YYYY")}`,
  });
  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    if (!document) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(
        generateBBCode(document.content, inputs)
      );
      toast("Текст успешно скопирован");
    } catch {
      toast("Не удалось скопировать текст");
    }
  }
  return (
    <form
      className="relative w-min max-w-[550px] mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="container px-4 py-6 w-min whitespace-pre-wrap rounded-sm bg-white text-black">
        {parseBBCode(document?.content, inputs, handleInputChange)}
      </div>
      <Button
        className="absolute bg-black/25 hover:bg-black/50 top-6 py-1 px-2 rounded-sm right-4 cursor-pointer"
        type="submit"
      >
        <Copy />
      </Button>
    </form>
  );
}
