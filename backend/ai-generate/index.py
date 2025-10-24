'''
Business: AI generation endpoint for characters, worlds, and story plots
Args: event - dict with httpMethod, body containing type (character/world/story) and prompt
      context - object with request_id attribute
Returns: HTTP response dict with AI-generated content
'''

import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    gen_type = body_data.get('type', '')
    prompt = body_data.get('prompt', '')
    world_context = body_data.get('worldContext', '')
    
    system_prompt = ''
    response_format = {}
    
    if gen_type == 'character':
        system_prompt = '''Ты - мастер создания персонажей для текстовых игр. Создай уникального персонажа на основе описания.

Верни JSON объект с полями:
{
  "name": "имя персонажа",
  "description": "краткое описание характера и роли (1-2 предложения)",
  "personality": "детальное описание личности, манер речи, привычек",
  "backstory": "предыстория персонажа",
  "avatar": "подходящий эмодзи для аватара",
  "traits": ["черта 1", "черта 2", "черта 3"]
}

Персонаж должен быть интересным и многогранным.'''
        response_format = {'type': 'json_object'}
        
    elif gen_type == 'world':
        system_prompt = '''Ты - мастер создания миров для текстовых игр. Создай уникальный мир на основе описания.

Верни JSON объект с полями:
{
  "name": "название мира",
  "description": "краткое описание (1-2 предложения)",
  "genre": "жанр (Фэнтези, Киберпанк, Sci-Fi, и т.д.)",
  "setting": "детальное описание сеттинга и атмосферы",
  "lore": "ключевые элементы истории и мифологии мира",
  "themes": ["тема 1", "тема 2", "тема 3"]
}

Мир должен быть проработанным и атмосферным.'''
        response_format = {'type': 'json_object'}
        
    elif gen_type == 'story':
        system_prompt = '''Ты - мастер сюжетов для интерактивных историй. Создай увлекательный сюжет на основе описания мира и пожеланий.

Верни JSON объект с полями:
{
  "title": "название истории",
  "summary": "краткое описание сюжета",
  "hook": "захватывающее начало истории",
  "plotPoints": ["ключевое событие 1", "ключевое событие 2", "ключевое событие 3"],
  "conflict": "центральный конфликт истории",
  "themes": ["тема 1", "тема 2"]
}

Сюжет должен быть динамичным и интересным.'''
        response_format = {'type': 'json_object'}
    
    user_prompt = f"{prompt}\n\nКонтекст мира: {world_context}" if world_context else prompt
    
    request_data = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ],
        'response_format': response_format,
        'temperature': 0.8,
        'max_tokens': 1000
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=request_data,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            response_data = json.loads(response.read().decode('utf-8'))
            generated_content = json.loads(response_data['choices'][0]['message']['content'])
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'type': gen_type,
                    'content': generated_content,
                    'requestId': context.request_id
                })
            }
    except urllib.error.HTTPError as e:
        error_text = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API error', 'details': error_text}),
            'isBase64Encoded': False
        }
