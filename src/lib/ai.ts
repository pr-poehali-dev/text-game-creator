import funcUrls from '../../backend/func2url.json';

export interface Character {
  id: string;
  name: string;
  description: string;
  personality?: string;
  backstory?: string;
  avatar: string;
  world: string;
  traits?: string[];
}

export interface World {
  id: string;
  name: string;
  description: string;
  genre: string;
  characters: number;
  setting?: string;
  lore?: string;
  themes?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const sendChatMessage = async (
  character: Character,
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> => {
  const response = await fetch(funcUrls['ai-chat'], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      characterId: character.id,
      characterName: character.name,
      characterDescription: character.description,
      message: message,
      conversationHistory: conversationHistory
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get AI response');
  }

  const data = await response.json();
  return data.message;
};

export const generateCharacter = async (prompt: string, worldContext?: string): Promise<Character> => {
  const response = await fetch(funcUrls['ai-generate'], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'character',
      prompt: prompt,
      worldContext: worldContext
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate character');
  }

  const data = await response.json();
  const content = data.content;
  
  return {
    id: Date.now().toString(),
    name: content.name,
    description: content.description,
    personality: content.personality,
    backstory: content.backstory,
    avatar: content.avatar,
    world: worldContext || 'Новый мир',
    traits: content.traits
  };
};

export const generateWorld = async (prompt: string): Promise<World> => {
  const response = await fetch(funcUrls['ai-generate'], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'world',
      prompt: prompt
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate world');
  }

  const data = await response.json();
  const content = data.content;
  
  return {
    id: Date.now().toString(),
    name: content.name,
    description: content.description,
    genre: content.genre,
    characters: 0,
    setting: content.setting,
    lore: content.lore,
    themes: content.themes
  };
};

export const generateStory = async (prompt: string, worldContext?: string): Promise<any> => {
  const response = await fetch(funcUrls['ai-generate'], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'story',
      prompt: prompt,
      worldContext: worldContext
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate story');
  }

  const data = await response.json();
  return data.content;
};
