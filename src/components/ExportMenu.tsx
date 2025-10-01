import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToPDF, exportToJSON, type ExportData } from "@/utils/exportData";
import { toast } from "sonner";

interface ExportMenuProps {
  data: ExportData;
}

export const ExportMenu = ({ data }: ExportMenuProps) => {
  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    try {
      switch (format) {
        case 'csv':
          exportToCSV(data);
          break;
        case 'pdf':
          exportToPDF(data);
          break;
        case 'json':
          exportToJSON(data);
          break;
      }
      toast.success(`Dados exportados em ${format.toUpperCase()} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao exportar dados');
      console.error('Export error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Exportar dados">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" />
          Exportar JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
