import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PreviewDocument from "@/components/preview-document";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/header";

function App() {
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { data: documents } = useQuery({
    queryKey: ["documents", { departmentId }],
    queryFn: async () => {
      if (!departmentId) {
        const { data, error } = await supabase.from("documents").select("*");
        if (error) throw new Error(error.message);
        return data;
      }
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("department_id", departmentId);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const { data: document, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["documents", { documentId }],
    queryFn: async () => {
      if (!documentId) {
        return null;
      }
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <Select onValueChange={(id) => setDepartmentId(Number(id))}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите отдел" />
          </SelectTrigger>
          <SelectContent>
            {departments?.map(({ id, name }) => (
              <SelectItem key={id} value={id.toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(id) => setDocumentId(Number(id))}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите документ" />
          </SelectTrigger>
          <SelectContent>
            {documents?.map(({ id, title }) => (
              <SelectItem key={id} value={id.toString()}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Accordion type="single" collapsible>
          <AccordionItem value="notes">
            <AccordionTrigger>Примечания</AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-wrap">{document?.note}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {isDocumentLoading && (
          <Skeleton className="h-[750px] w-[520px] mx-auto" />
        )}
        {document && <PreviewDocument document={document} />}
      </main>
      <Toaster />
    </>
  );
}

export default App;
