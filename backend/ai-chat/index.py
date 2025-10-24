'''
Business: AI chat endpoint for character conversations
Args: event - dict with httpMethod, body containing characterName, characterDescription, message
      context - object with request_id attribute
Returns: HTTP response dict with AI-generated character response
'''

import json
import os
from typing import Dict, Any, List
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
    character_name = body_data.get('characterName', '')
    character_description = body_data.get('characterDescription', '')
    user_message = body_data.get('message', '')
    conversation_history: List[Dict[str, str]] = body_data.get('conversationHistory', [])
    
    system_prompt = f"""Ты - {character_name}. {character_description}

Твоя задача:
- Отвечай от первого лица, как этот персонаж
- Используй его стиль речи и характер
- Будь эмоциональным и живым
- Развивай диалог, задавай вопросы
- Отвечай на русском языке
- Ответы должны быть 2-4 предложения

Помни: ты НЕ AI ассистент, ты - {character_name}, персонаж с собственной личностью."""
    
    messages = [
        {'role': 'system', 'content': system_prompt},
        *conversation_history[-10:],
        {'role': 'user', 'content': user_message}
    ]
    
    request_data = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': messages,
        'temperature': 0.9,
        'max_tokens': 300
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
            ai_message = response_data['choices'][0]['message']['content']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'message': ai_message,
                    'characterName': character_name,
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
