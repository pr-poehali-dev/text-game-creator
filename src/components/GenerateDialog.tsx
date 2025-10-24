import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface GenerateDialogProps {
  type: 'character' | 'world';
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export const GenerateDialog = ({ type, onGenerate, isGenerating }: GenerateDialogProps) => {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    await onGenerate(prompt);
    setPrompt('');
    setIsOpen(false);
  };

  const title = type === 'character' ? 'Создать персонажа' : 'Создать мир';
  const description = type === 'character' 
    ? 'Опиши персонажа и AI создаст его для тебя'
    : 'Опиши мир и AI сгенерирует его детали';
  const placeholder = type === 'character'
    ? 'Например: Создай хакера-одиночку из киберпанк мира с загадочным прошлым'
    : 'Например: Создай мир в стиле киберпанк с неоновыми улицами и мегакорпорациями';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent">
          <Icon name="Plus" size={20} className="mr-2" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Описание</Label>
            <Textarea
              id="prompt"
              placeholder={placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
              disabled={isGenerating}
            />
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            {isGenerating ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Генерирую...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={20} className="mr-2" />
                Создать с помощью AI
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateDialog;
