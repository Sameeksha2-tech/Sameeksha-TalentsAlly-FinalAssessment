"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Download, Sparkles, Wand2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateImageFromPrompt } from "@/ai/flows/generate-image-from-prompt";
import { createImageVariations } from "@/ai/flows/create-image-variations";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedPromptForVariation, setLastUsedPromptForVariation] = useState<string>("");

  const handleGenerateImage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null); 

    try {
      const result = await generateImageFromPrompt({ prompt });
      if (result.imageDataUri) {
        setGeneratedImage(result.imageDataUri);
        setLastUsedPromptForVariation(prompt);
      } else {
        setError("AI did not return an image. Please try a different prompt.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate image.";
      if (errorMessage.includes("Billing account not found")) {
        setError("Image generation failed: Billing account not found or not associated with the project. Please check your Google Cloud project configuration.");
      } else if (errorMessage.includes("Vertex AI API has not been used")) {
         setError("Image generation failed: Vertex AI API is not enabled or has not been used in the project. Please enable it and ensure it's set up correctly.");
      }
      else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVariation = async () => {
    if (!generatedImage) {
      setError("No image available to create a variation from.");
      return;
    }
    
    const variationPrompt = prompt.trim() || lastUsedPromptForVariation;
    if (!variationPrompt) {
         setError("Please provide a prompt for the variation.");
         return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createImageVariations({
        baseImageDataUri: generatedImage,
        prompt: variationPrompt,
      });
      if (result.variedImageDataUri) {
        setGeneratedImage(result.variedImageDataUri);
        setLastUsedPromptForVariation(variationPrompt);
      } else {
        setError("AI did not return an image variation. Please try again.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create image variation.";
       if (errorMessage.includes("Billing account not found")) {
        setError("Image variation failed: Billing account not found or not associated with the project. Please check your Google Cloud project configuration.");
      } else if (errorMessage.includes("Vertex AI API has not been used")) {
         setError("Image variation failed: Vertex AI API is not enabled or has not been used in the project. Please enable it and ensure it's set up correctly.");
      }
      else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFileExtensionFromDataUri = (dataUri: string): string => {
    const mimeTypeMatch = dataUri.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (mimeTypeMatch && mimeTypeMatch[1]) {
      const mimeType = mimeTypeMatch[1];
      switch (mimeType) {
        case 'image/jpeg': return 'jpg';
        case 'image/png': return 'png';
        case 'image/gif': return 'gif';
        case 'image/webp': return 'webp';
        default: return mimeType.split('/')[1] || 'png';
      }
    }
    return 'png'; // Default to png if MIME type is not parseable
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const extension = getFileExtensionFromDataUri(generatedImage);
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `visionary_ai_image_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl bg-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
             <Wand2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline text-primary">Visionary AI</CardTitle>
          <p className="text-muted-foreground">Craft stunning visuals from your imagination.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div>
              <Textarea
                placeholder="Describe the image you want to create... (e.g., 'A futuristic cityscape at sunset')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none text-base focus:ring-accent"
                disabled={isLoading}
                aria-label="Image generation prompt"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !prompt.trim()}>
              {isLoading && !generatedImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Image
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && !generatedImage && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[300px] mt-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">Generating your masterpiece...</p>
              <p className="text-sm text-muted-foreground">This might take a moment.</p>
            </div>
          )}
          
          {generatedImage && (
            <div className="mt-6 space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border shadow-lg bg-muted/20 transition-opacity duration-500 ease-in-out">
                <Image
                  src={generatedImage}
                  alt={prompt || "Generated AI image"}
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint="generated art"
                  className="transition-opacity duration-300 ease-in-out"
                  onLoadingComplete={(img) => img.style.opacity = '1'}
                  style={{opacity: 0}}
                />
                 {isLoading && ( 
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-10 rounded-lg">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-2 text-foreground font-semibold">Creating variation...</p>
                    </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {generatedImage && !isLoading && (
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleCreateVariation} variant="outline" className="w-full sm:w-auto flex-1" disabled={isLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              Create Variation
            </Button>
            <Button onClick={handleDownloadImage} className="w-full sm:w-auto flex-1" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </CardFooter>
        )}
      </Card>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Visionary AI. Powered by GenAI.</p>
      </footer>
    </div>
  );
}
