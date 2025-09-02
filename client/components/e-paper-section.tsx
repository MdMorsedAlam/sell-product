"use client";

import { useLanguage } from "../providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { IEpaper } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import { saveAs } from "file-saver"; // Import file-saver
import toast from "react-hot-toast";

export default function EPaperSection() {
  const { language, t } = useLanguage();
  const { data, refetch } = useApi<IEpaper[]>(["epaper"], `/epaper`);
  const [epapers, setEpapers] = useState<IEpaper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < epapers.length - 3 ? prev + 1 : prev));
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      if (data) {
        setEpapers(data);
      }
    };
    fetchData();
  }, [data]);

  // Function to handle PDF download using file-saver
  const handleDownload = (epaper: IEpaper) => {
    const fullPath = getImageUrl(epaper.file); // Resolves the full file path

    // Log to verify the file URL

    // Check if the URL is valid
    if (!fullPath) {
      toast.error("Invalid PDF URL.");
      return;
    }

    // Use file-saver to download the PDF
    saveAs(fullPath, `${epaper.title}.pdf`); // Download the PDF using the title as filename
  };

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="border-l-4 border-red-600 pl-2">
          {t("section.epaper")}
        </span>
      </h2>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Latest editions</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= epapers.length - 3}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {epapers.slice(currentIndex, currentIndex + 3).map((epaper) => (
            <Card key={epaper._id} className="overflow-hidden">
              <div className="relative h-80 group">
                <Image
                  src={getImageUrl(epaper.thumbnail) || "/placeholder.svg"}
                  alt={epaper.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <Link href={`/epaper/${epaper._id}`}>
                    <Button className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Read Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(epaper)} // Handle download click
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{epaper.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {epaper.date.toString().slice(0, 10)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
