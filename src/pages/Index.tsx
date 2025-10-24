import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

type ViewType = 'home' | 'worlds' | 'characters' | 'stories' | 'profile' | 'chat';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  world: string;
}

interface World {
  id: string;
  name: string;
  description: string;
  genre: string;
  characters: number;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const worlds: World[] = [
    {
      id: '1',
      name: 'Кибер-Токио 2099',
      description: 'Неоновый мегаполис будущего с киберпанк атмосферой',
      genre: 'Киберпанк',
      characters: 5
    },
    {
      id: '2',
      name: 'Академия Магии',
      description: 'Престижная школа магических искусств в параллельном мире',
      genre: 'Фэнтези',
      characters: 8
    },
    {
      id: '3',
      name: 'Звёздный Корабль Надежда',
      description: 'Космический крейсер исследующий далёкие галактики',
      genre: 'Sci-Fi',
      characters: 6
    }
  ];

  const characters: Character[] = [
    {
      id: '1',
      name: 'Юки',
      description: 'Хакер-одиночка с загадочным прошлым',
      avatar: '👩‍💻',
      world: 'Кибер-Токио 2099'
    },
    {
      id: '2',
      name: 'Акира',
      description: 'Капитан звёздного корабля с железной волей',
      avatar: '🧑‍✈️',
      world: 'Звёздный Корабль Надежда'
    },
    {
      id: '3',
      name: 'Сакура',
      description: 'Талантливая студентка магической академии',
      avatar: '🧙‍♀️',
      world: 'Академия Магии'
    },
    {
      id: '4',
      name: 'Рен',
      description: 'Загадочный маг со способностью видеть будущее',
      avatar: '🔮',
      world: 'Академия Магии'
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedCharacter) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `${selectedCharacter.name}: Интересно! Расскажи мне больше об этом...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startChat = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('chat');
    setMessages([{
      id: '0',
      sender: 'ai',
      text: `Привет! Я ${character.name}. ${character.description}. О чём поговорим?`,
      timestamp: new Date()
    }]);
  };

  const menuItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'worlds', label: 'Миры', icon: 'Globe' },
    { id: 'characters', label: 'Персонажи', icon: 'Users' },
    { id: 'stories', label: 'Истории', icon: 'BookOpen' },
    { id: 'profile', label: 'Профиль', icon: 'User' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/20">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card border-border">
              <div className="flex flex-col gap-4 mt-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Story World
                </h2>
                <nav className="flex flex-col gap-2">
                  {menuItems.map(item => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      className="justify-start gap-3"
                      onClick={() => {
                        setCurrentView(item.id as ViewType);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Icon name={item.icon as any} size={20} />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            AI Story World
          </h1>

          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Icon name="Sparkles" size={24} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        {currentView === 'home' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-4 py-12">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Создай свою историю
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Общайся с AI персонажами, создавай уникальные миры и пиши захватывающие истории
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  onClick={() => setCurrentView('worlds')}
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Начать приключение
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setCurrentView('characters')}
                >
                  <Icon name="Users" size={20} className="mr-2" />
                  Познакомиться с героями
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/20">
                      <Icon name="Wand2" size={24} className="text-primary" />
                    </div>
                    <CardTitle>Мастер Сюжета</CardTitle>
                  </div>
                  <CardDescription>
                    AI подберёт идеальный сюжет по описанию твоего мира
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-accent/30 hover:border-accent/60 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-accent/20">
                      <Icon name="MessageSquare" size={24} className="text-accent" />
                    </div>
                    <CardTitle>Живые Диалоги</CardTitle>
                  </div>
                  <CardDescription>
                    Общайся с персонажами как с настоящими людьми
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-secondary/20">
                      <Icon name="Palette" size={24} className="text-secondary" />
                    </div>
                    <CardTitle>AI Генерация</CardTitle>
                  </div>
                  <CardDescription>
                    Создавай картинки и анимации для твоих историй
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/20">
                      <Icon name="BookOpen" size={24} className="text-primary" />
                    </div>
                    <CardTitle>Твоя История</CardTitle>
                  </div>
                  <CardDescription>
                    Создавай уникальные сюжеты и развивай свой мир
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'worlds' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Миры</h2>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать мир
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worlds.map(world => (
                <Card key={world.id} className="hover:scale-105 transition-transform duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{world.name}</CardTitle>
                      <Badge variant="secondary">{world.genre}</Badge>
                    </div>
                    <CardDescription>{world.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Users" size={16} />
                        {world.characters} персонажей
                      </span>
                      <Button size="sm" variant="outline">
                        Открыть
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === 'characters' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Персонажи</h2>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать персонажа
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {characters.map(character => (
                <Card key={character.id} className="hover:scale-105 transition-all duration-300 border-border/50 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 text-3xl">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                          {character.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle>{character.name}</CardTitle>
                        <CardDescription>{character.description}</CardDescription>
                        <Badge variant="outline" className="mt-2">
                          {character.world}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent"
                      onClick={() => startChat(character)}
                    >
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Начать диалог
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === 'chat' && selectedCharacter && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <Card className="border-primary/30">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCurrentView('characters')}
                  >
                    <Icon name="ArrowLeft" size={20} />
                  </Button>
                  <Avatar className="h-12 w-12 text-2xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      {selectedCharacter.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedCharacter.name}</CardTitle>
                    <CardDescription>{selectedCharacter.world}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-6">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-primary to-accent text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p>{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-border/50 p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Напиши сообщение..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="bg-gradient-to-r from-primary to-accent">
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'stories' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Мои Истории</h2>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Icon name="Plus" size={20} className="mr-2" />
                Новая история
              </Button>
            </div>
            <div className="text-center py-12">
              <Icon name="BookOpen" size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Здесь будут твои истории</p>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Профиль</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 text-4xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      🧑‍🎨
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Творец Миров</CardTitle>
                    <CardDescription>Участник с октября 2025</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <div className="text-3xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Миров</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/10">
                    <div className="text-3xl font-bold text-accent">4</div>
                    <div className="text-sm text-muted-foreground">Персонажей</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary/10">
                    <div className="text-3xl font-bold text-secondary">0</div>
                    <div className="text-sm text-muted-foreground">Историй</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
