import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get survey statistics from database
    Args: event - dict with httpMethod
          context - object with request_id
    Returns: HTTP response dict with statistics
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM survey_responses")
    total_responses = cur.fetchone()[0]
    
    cur.execute("""
        SELECT profile_type, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY profile_type
    """)
    profile_stats = [{'profile': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.execute("""
        SELECT question_1, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY question_1
    """)
    q1_stats = [{'answer': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.execute("""
        SELECT question_2, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY question_2
    """)
    q2_stats = [{'answer': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.execute("""
        SELECT question_3, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY question_3
    """)
    q3_stats = [{'answer': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.execute("""
        SELECT question_4, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY question_4
    """)
    q4_stats = [{'answer': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.execute("""
        SELECT question_5, COUNT(*) as count 
        FROM survey_responses 
        GROUP BY question_5
    """)
    q5_stats = [{'answer': row[0], 'count': row[1]} for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    stats = {
        'totalResponses': total_responses,
        'profileStats': profile_stats,
        'questionStats': {
            'q1': q1_stats,
            'q2': q2_stats,
            'q3': q3_stats,
            'q4': q4_stats,
            'q5': q5_stats
        }
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(stats)
    }
